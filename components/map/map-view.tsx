'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useRef } from 'react'
import { searchInspections } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LocateIcon, MapPinIcon } from 'lucide-react'

// Fix for default markers in React Leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const evaluationColors: Record<number, string> = {
  1: '#22c55e', // Green
  2: '#eab308', // Yellow
  3: '#f97316', // Orange
  4: '#ef4444', // Red
}

function getEvaluationIcon(code: number) {
  const color = evaluationColors[code] || '#64748b' // fallback: gray
  return L.divIcon({
    className: '',
    html: `<svg width="32" height="32" viewBox="0 0 32 32" fill="${color}" stroke="white" stroke-width="2" style="filter: drop-shadow(0 1px 2px #0003)">
      <circle cx="16" cy="16" r="12" />
    </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

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

interface InspectionResult {
  id: number;
  latitude: number;
  longitude: number;
  evaluationCode: number;
  businessName: string;
  address: string;
  city: string;
  postalCode: string;
  evaluation?: string;
  // add other fields as needed
}

export function MapView({ initialQuery }: { initialQuery: string }) {
  const { location, loading, error } = useGeolocation()
  // Default to Paris if no location available
  // Radius state (capped)
  const [radius, setRadius] = useState(5) // default 5km
  const MAX_RADIUS = 10
  // Truncation warning state
  const [truncationWarning, setTruncationWarning] = useState(false)
  // Results state
  const [results, setResults] = useState<InspectionResult[]>([])

  // Ensure map renders properly in Next.js
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const mapRef = useRef(null)

  const getInitialCenter = () => {
    if (initialQuery) {
      return [48.8566, 2.3522] // todo: get initial center from initialQuery
    }
    return location ? [location.lat, location.lng] : [48.8566, 2.3522]
  }

  const initialCenter = useRef<[number, number]>(location ? [location.lat, location.lng] : [48.8566, 2.3522]);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  async function handleTestSpatialSearch() {
    let lat: number, lng: number;
    if (mapRef.current) {
      // @ts-expect-error Leaflet types are not properly defined
      const center = mapRef.current.getCenter();
      lat = center.lat;
      lng = center.lng;
    } else if (location) {
      lat = location.lat;
      lng = location.lng;
    } else {
      lat = 48.8566;
      lng = 2.3522;
    }
    const result = await searchInspections('', 1, 500, 'inspectionDate', 'desc', undefined, { lat, lng, radius })
    const results = result.data.map(item => ({
      id: item.id,
      latitude: item.latitude!,
      longitude: item.longitude!,
      evaluationCode: item.evaluationCode,
      businessName: item.businessName,
      address: item.address,
      city: item.city,
      postalCode: item.postalCode,
      evaluation: item.evaluation,
    }))
    setResults(results)
    setTruncationWarning(result.data.length === 500)
    // Fit bounds to results
    if (mapRef.current && result.data.length > 0) {
      const group = L.featureGroup(
        result.data.map(item => L.marker([item.latitude!, item.longitude!]))
      );
            // @ts-expect-error Leaflet types are not properly defined
      mapRef.current.fitBounds(group.getBounds(), { maxZoom: 16, padding: [40, 40] });
    }
  }

  function handleRecenterToUser() {
    if (location && mapRef.current) {
      // @ts-expect-error Leaflet types
      mapRef.current.setView([location.lat, location.lng], 16);
    }
  }

  return (
    <div className="space-y-4">
      {/* Truncation warning */}
      {truncationWarning && (
        <Alert variant="default" className="mb-2 text-yellow-500 bg-yellow-500/10 border-yellow-500">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Affichage limité</AlertTitle>
          <AlertDescription className="text-yellow-500">
            Affichage limité aux 500 premiers résultats. Veuillez réduire le rayon ou affiner votre recherche.
          </AlertDescription>
        </Alert>
      )}
      {/* Radius slider */}
      <div className="flex items-center gap-4">
        <label htmlFor="radius-slider" className="text-sm font-medium">Rayon de recherche :</label>
        <input
          id="radius-slider"
          type="range"
          min={0.1}
          max={MAX_RADIUS}
          step={0.1}
          value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="w-40"
        />
        <span className="text-sm tabular-nums">{radius} km</span>
        <span className="text-xs text-muted-foreground">(min 0.1 km, max {MAX_RADIUS} km)</span>
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

      <div className="flex gap-2 mb-2 flex justify-between w-full">
        {/* Recenter to user location */}

        {/* Search at current map center */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="default" className="bg-green-500 text-white" onClick={handleTestSpatialSearch}>
              <MapPinIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="text-sm max-w-xs">
            Lancer la recherche autour du centre de la carte
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline" onClick={handleRecenterToUser}>
              <LocateIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="text-sm max-w-xs">
            Recentrer la carte sur ma position
          </PopoverContent>
        </Popover>
      </div>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border">
        <MapContainer
          ref={mapRef}
          center={initialCenter.current}
          zoom={location ? 16 : 10}
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
                <span className="text-sm">Votre position</span>
              </Popup>
            </Marker>
          )}

          {results
            .filter(item =>
              typeof item.latitude === 'number' &&
              typeof item.longitude === 'number' &&
              !isNaN(item.latitude) &&
              !isNaN(item.longitude)
            )
            .map(item => (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={getEvaluationIcon(item.evaluationCode)}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{item.businessName}</strong><br />
                    {item.address}<br />
                    {item.city} {item.postalCode}<br />
                    {item.evaluation && (<span>Évaluation: {item.evaluation}</span>)}
                  </div>
                </Popup>
              </Marker>
            ))
          }

          {/* Only show MapUpdater on initial mount, and only center on Paris if no user location */}
          {!hasMounted && (
            <MapUpdater center={location ? [location.lat, location.lng] : [48.8566, 2.3522]} zoom={location ? 16 : 10} />
          )}
        </MapContainer>
      </div>
    </div>
  )
} 