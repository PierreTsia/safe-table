'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { searchInspections } from '@/lib/supabase'

// Fix for default markers in React Leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom hook for geolocation
function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (error) => {
        console.log('Geolocation error:', error.message)
        setError(error.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }, [])

  return { location, loading, error }
}

// Component to update map center and zoom when location changes
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}

interface MapViewProps {
  initialQuery: string
}

export function MapView({ initialQuery }: MapViewProps) {
  const { location, loading, error } = useGeolocation()
  
  // Default to Paris if no location available
  const defaultCenter: [number, number] = [48.8566, 2.3522]
  const mapCenter: [number, number] = location ? [location.lat, location.lng] : defaultCenter
  const mapZoom = location ? 14 : 10

  // Radius state (capped)
  const [radius, setRadius] = useState(5) // default 5km
  const MAX_RADIUS = 10

  // Ensure map renders properly in Next.js
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Test handler for hardcoded spatial search (now uses radius)
  async function handleTestSpatialSearch() {
    const lat = 48.8566 // Paris
    const lng = 2.3522
    const result = await searchInspections('', 1, 10, 'inspectionDate', 'desc', undefined, { lat, lng, radius })
     
    console.log('Spatial search result:', result)
    alert(`Spatial search: ${result.data.length} results for radius ${radius}km`)
  }

  return (
    <div className="space-y-4">
      {/* Radius slider */}
      <div className="flex items-center gap-4">
        <label htmlFor="radius-slider" className="text-sm font-medium">Rayon de recherche :</label>
        <input
          id="radius-slider"
          type="range"
          min={1}
          max={MAX_RADIUS}
          value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="w-40"
        />
        <span className="text-sm tabular-nums">{radius} km</span>
        <span className="text-xs text-muted-foreground">(max {MAX_RADIUS} km)</span>
      </div>
      {/* Location status */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Localisation en cours...
        </div>
      )}
      
      {error && (
        <div className="text-sm text-muted-foreground">
          Localisation non disponible - Affichage de Paris par défaut
        </div>
      )}

      {location && (
        <div className="text-sm text-muted-foreground">
          Votre position: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      )}

      <button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        onClick={handleTestSpatialSearch}
        type="button"
      >
        Tester la recherche géolocalisée ({radius}km autour de Paris)
      </button>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          {location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <span className="text-sm">
                    Votre position
                </span>
              </Popup>
            </Marker>
          )}

          {/* Default Paris marker if no user location */}
          {!location && (
            <Marker position={defaultCenter}>
              <Popup>
              <span className="text-sm">
                    Paris
                </span>
              </Popup>
            </Marker>
          )}

          {/* Update map center when location changes */}
          <MapUpdater center={mapCenter} zoom={mapZoom} />
        </MapContainer>
      </div>
    </div>
  )
} 