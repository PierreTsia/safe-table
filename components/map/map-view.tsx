'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LocateIcon, MapPinIcon } from 'lucide-react'
import type { Map as LeafletMap } from 'leaflet'
import type { InspectionResult } from '@/app/search/page'

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

// Component to update map center and zoom when location changes
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}



interface MapViewProps {
  results: InspectionResult[];
  center: [number, number];
  radius: number;
  loading: boolean;
  truncationWarning: boolean;
  onRadiusChange: (radius: number) => void;
  onSearchAtCenter: (center: [number, number], radius: number) => void;
  onMoveEnd: (center: [number, number], zoom: number) => void;
  onRecenter: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

export function MapView({
  results,
  center,
  radius,
  loading,
  truncationWarning,
  onRadiusChange,
  onSearchAtCenter,
  onMoveEnd,
  onRecenter,
  userLocation,
}: MapViewProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const prevCenter = useRef<[number, number] | null>(null);


  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Recenter map when center prop changes
  useEffect(() => {
    if (
      mapRef.current &&
      (!prevCenter.current ||
        prevCenter.current[0] !== center[0] ||
        prevCenter.current[1] !== center[1])
    ) {
      setTimeout(() => {
        mapRef.current!.setView(center, mapRef.current!.getZoom());
        prevCenter.current = center;
      }, 0);
    }
  }, [center]);

  // Ensure map renders properly in Next.js
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Listen for map move events
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const handleMoveEnd = () => {
      const c = map.getCenter();
      const newCenter: [number, number] = [c.lat, c.lng];
      
      // Only trigger search if the move is significant (more than ~50 meters)
      if (prevCenter.current) {
        const distance = Math.sqrt(
          Math.pow(newCenter[0] - prevCenter.current[0], 2) + 
          Math.pow(newCenter[1] - prevCenter.current[1], 2)
        );
        // 0.0005 degrees ≈ 50 meters at this latitude
        if (distance < 0.0005) {
          return; // Ignore tiny moves
        }
      }
      
      onMoveEnd(newCenter, map.getZoom());
      prevCenter.current = newCenter;
    };
    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [onMoveEnd]);

  const MAX_RADIUS = 10;

  return (
    <div className="space-y-4 ">
      {/* Truncation warning */}
     
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
          onChange={e => onRadiusChange(Number(e.target.value))}
          className="w-40"
        />
        <span className="text-sm tabular-nums">{radius} km</span>
        <span className="text-xs text-muted-foreground">(min 0.1 km, max {MAX_RADIUS} km)</span>
      </div>

      {/* Location status */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Chargement en cours...
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          {results.length} résultats
        </div>
      )}

      

      <div className="flex gap-2 mb-2 flex justify-between w-full items-center h-24">
        {/* Search at current map center */}
        <Popover >
          <PopoverTrigger asChild >
            <Button size="icon" variant="default" className="bg-green-500 text-white" onClick={() => onSearchAtCenter(center, radius)}>
              <MapPinIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="text-sm max-w-xs">
            Lancer la recherche autour du centre de la carte
          </PopoverContent>
        </Popover>
        {truncationWarning && (
        <Alert variant="default" className=" max-w-4xl text-yellow-500 bg-yellow-500/10 border-yellow-500">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Affichage limité</AlertTitle>
          <AlertDescription className="text-yellow-500">
            Affichage limité aux 500 premiers résultats. Veuillez réduire le rayon ou affiner votre recherche.
          </AlertDescription>
        </Alert>
      )}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline" onClick={onRecenter}>
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
          center={center}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
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
                eventHandlers={{
                  mouseover: (e) => {
                    if (!('ontouchstart' in window)) { // Desktop only
                      const marker = e.target;
                      const popupContent = `
                        <div class="text-sm">
                          <strong>${item.businessName}</strong><br />
                          ${item.businessType}<br/>
                          ${item.address}<br />
                          ${item.city} ${item.postalCode}<br />
                          ${item.evaluation ? `<span>Évaluation: ${item.evaluation}</span>` : ''}
                        </div>
                      `;
                      marker.bindPopup(popupContent, { autoPan: false }).openPopup();
                    }
                  },
                  mouseout: (e) => {
                    if (!('ontouchstart' in window)) {
                      const marker = e.target;
                      marker.closePopup();
                    }
                  },
                  click: (e) => {
                    if ('ontouchstart' in window) { // Mobile only
                      const marker = e.target;
                      const popupContent = `
                        <div class="text-sm">
                          <strong>${item.businessName}</strong><br />
                          ${item.businessType}<br/>
                          ${item.address}<br />
                          ${item.city} ${item.postalCode}<br />
                          ${item.evaluation ? `<span>Évaluation: ${item.evaluation}</span>` : ''}
                        </div>
                      `;
                      marker.bindPopup(popupContent, { autoPan: false }).openPopup();
                    }
                  }
                }}
              />
            ))
          }

          {/* Only show MapUpdater on initial mount */}
          {!hasMounted && (
            <MapUpdater center={center} zoom={16} />
          )}
        </MapContainer>
      </div>
    </div>
  )
} 