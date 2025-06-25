'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

// Fix for default markers in React Leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapViewProps {
  initialQuery: string
}

export function MapView({ initialQuery }: MapViewProps) {
  // Ensure map renders properly in Next.js
  useEffect(() => {
    // Force a re-render when component mounts
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[46.603354, 1.888334]} // Center of France
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Placeholder marker for Paris */}
        <Marker position={[48.8566, 2.3522]}>
          <Popup>
            <div className="text-sm">
              <strong>Paris</strong><br />
              Recherche: {initialQuery}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
} 