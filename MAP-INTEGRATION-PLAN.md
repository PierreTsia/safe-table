# 🗺️ Map Integration & Spatial Search - Implementation Plan

## 📋 Overview

This document outlines the implementation plan for adding map-based visualization and spatial search capabilities to SafeTable. The goal is to enable users to search for food safety inspections by location and visualize results geographically.

## 🏗️ Current Foundation

### ✅ Backend Ready
- **Database**: `latitude`/`longitude` fields available in inspections table
- **Spatial Function**: `findInspectionsWithinRadius()` already implemented
- **Distance Calculation**: Returns `distance_km` for spatial queries
- **Performance**: Proper indexing for spatial queries

### ✅ Frontend Architecture
- **Search Controls**: Extensible pattern for adding spatial filters
- **URL State Management**: Ready for lat/lng/radius parameters
- **Performance**: TanStack Query caching system in place
- **Responsive Design**: Mobile-first approach established

---

## 🎯 Implementation Phases

### **Phase 1: Core Map Infrastructure** (Week 1)
*Priority: HIGH - Foundation for all spatial features*

#### **Technical Decisions**
```
Map Provider Options:
├── Leaflet + OpenStreetMap (Recommended)
│   ├── ✅ Free, no API keys
│   ├── ✅ Good performance
│   ├── ✅ react-leaflet mature library
│   └── ⚠️ Basic styling options
│
└── Mapbox GL JS (Alternative)
    ├── ✅ Superior UX and styling
    ├── ✅ Better performance for large datasets
    ├── ⚠️ Requires API key + billing
    └── ⚠️ More complex setup
```

**Recommendation**: Start with Leaflet for MVP, migrate to Mapbox if needed.

#### **Component Architecture**
```
components/map/
├── map-container.tsx           # Main map wrapper component
├── inspection-marker.tsx       # Individual establishment pins
├── cluster-marker.tsx          # Grouped markers for performance
├── search-radius-circle.tsx    # Draggable radius indicator
├── map-controls.tsx            # Zoom, locate user, layer toggles
├── map-loading.tsx             # Loading state component
└── types.ts                    # Map-specific TypeScript types
```

#### **Core Features**
- [ ] **Basic Map Display**
  - Interactive OpenStreetMap base layer
  - France-centered initial view
  - Responsive container (desktop + mobile)
  
- [ ] **Inspection Markers**
  - Color-coded by evaluation code (1-4)
  - Click for inspection details popup
  - Custom SVG icons for different business types
  
- [ ] **Search Radius Visualization**
  - Draggable circle overlay
  - Real-time radius display (km)
  - Visual feedback for search area

#### **Dependencies**
```bash
npm install leaflet react-leaflet @types/leaflet
```

---

### **Phase 2: Spatial Search Integration** (Week 2)
*Priority: HIGH - Core user functionality*

#### **Search Flow Enhancement**
```
User Journey Options:
├── Map-First Flow
│   ├── 1. Click map location
│   ├── 2. Adjust radius slider
│   ├── 3. Apply text filters (optional)
│   └── 4. View results on map + list
│
├── Search-First Flow  
│   ├── 1. Enter text query
│   ├── 2. Toggle map view
│   ├── 3. Select location on map
│   └── 4. Apply spatial filter
│
└── Hybrid Flow
    ├── 1. Enter location name
    ├── 2. Geocode to coordinates  
    ├── 3. Set radius + filters
    └── 4. Combined spatial + text search
```

#### **UI Components**
- [ ] **Location Input**
  - Address/city autocomplete
  - "Use current location" button
  - Map click location picker
  
- [ ] **Radius Controls**
  - Slider: 1km - 50km range
  - Preset buttons: 5km, 10km, 25km
  - Visual feedback on map
  
- [ ] **View Toggle**
  - List/Map/Split view options
  - Responsive behavior (mobile = tabs)
  - State persistence in URL

#### **Backend Integration**
- [ ] **Extended Search Function**
  ```typescript
  searchInspections(
    query: string,
    spatial?: {
      lat: number,
      lng: number, 
      radius: number
    },
    // ... existing params
  )
  ```

- [ ] **URL State Management**
  ```
  /search?q=restaurant&lat=48.8566&lng=2.3522&radius=10&type=Restaurants
  ```

#### **Performance Optimizations**
- Debounced spatial queries (500ms)
- Cache keys include spatial parameters
- Lazy load map bundle (code splitting)
- Marker virtualization for 1000+ results

---

### **Phase 3: Advanced Mapping Features** (Week 3)
*Priority: MEDIUM - Enhanced user experience*

#### **Marker Clustering**
- [ ] **Smart Clustering**
  - Group nearby establishments automatically
  - Cluster size indicates establishment count
  - Color indicates average risk level
  - Smooth zoom transitions

- [ ] **Cluster Interactions**
  - Click to zoom and expand cluster
  - Hover preview of cluster contents
  - Risk level distribution in tooltip

#### **Visual Enhancements**
- [ ] **Risk Heatmap Layer**
  - Toggle overlay for risk density
  - Color gradient: green (safe) → red (risky)
  - Adjustable intensity and radius

- [ ] **Business Type Icons**
  - Custom SVG markers per business type
  - Consistent with existing badge system
  - Scalable and accessible

#### **Mobile Optimization**
- [ ] **Touch Interactions**
  - Gesture-friendly controls
  - Bottom sheet for results overlay
  - Full-screen map mode

- [ ] **Performance**
  - Reduced marker density on mobile
  - Simplified clustering algorithm
  - Optimized bundle size

#### **Advanced Spatial Features**
- [ ] **Drive-time Isochrones** *(Optional)*
  - 5/10/15 minute drive polygons
  - Integration with routing service
  - Useful for delivery businesses

- [ ] **Administrative Boundaries** *(Optional)*
  - Commune/department overlays
  - Filter by administrative area
  - Statistical summaries by region

---

### **Phase 4: Intelligence & Export** (Week 4)
*Priority: LOW - Nice-to-have features*

#### **Spatial Analytics**
- [ ] **Risk Corridors**
  - Identify clusters of problematic establishments
  - Temporal analysis (risk over time)
  - Statistical significance testing

- [ ] **Comparative Analysis**
  - Risk density vs population density
  - Business type distribution maps
  - Inspection frequency patterns

#### **User Tools**
- [ ] **Saved Locations**
  - Bookmark favorite search areas
  - Personal dashboard of watched locations
  - Alert system for new inspections

- [ ] **Export Features**
  - "Establishments near me" CSV export
  - Shareable map links
  - Print-friendly map views

- [ ] **Geolocation Services**
  - Browser geolocation integration
  - IP-based location fallback
  - Privacy-conscious implementation

---

## 🔧 Technical Implementation Details

### **Core Dependencies**
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1", 
  "@types/leaflet": "^1.9.8",
  "leaflet.markercluster": "^1.5.3" // for clustering
}
```

### **Component Integration Points**

#### **Search Controls Extension**
```typescript
// components/search/search-controls.tsx
interface SearchControlsProps {
  // ... existing props
  spatial?: {
    lat: number
    lng: number
    radius: number
  }
  onSpatialChange: (spatial: SpatialFilter | undefined) => void
  mapView: boolean
  onMapViewToggle: (enabled: boolean) => void
}
```

#### **Map Container Integration**
```typescript
// components/map/map-container.tsx
interface MapContainerProps {
  inspections: InspectionDisplay[]
  onLocationSelect: (lat: number, lng: number) => void
  searchRadius?: number
  onRadiusChange: (radius: number) => void
  loading?: boolean
}
```

### **URL State Schema**
```typescript
interface SpatialSearchParams {
  lat?: number      // Center latitude
  lng?: number      // Center longitude  
  radius?: number   // Search radius in km
  mapView?: boolean // Show map view
  // ... existing search params
}
```

### **Performance Considerations**

#### **Bundle Optimization**
- Lazy load map components with dynamic imports
- Tree-shake unused Leaflet plugins
- Optimize marker icons (SVG > PNG)

#### **Data Optimization**
- Limit results to 500 establishments max
- Progressive marker loading on zoom
- Spatial indexing in database queries

#### **Caching Strategy**
```typescript
// TanStack Query cache keys
const spatialQueryKey = [
  'inspections', 
  'spatial',
  { lat, lng, radius, ...filters }
]
```

---

## 🚀 Implementation Roadmap

### **Week 1: Foundation**
- [ ] Set up Leaflet + react-leaflet
- [ ] Create basic MapContainer component
- [ ] Implement inspection markers
- [ ] Add to existing search page

### **Week 2: Core Features**
- [ ] Spatial search integration
- [ ] Radius controls and visualization
- [ ] URL state management
- [ ] Mobile responsiveness

### **Week 3: Polish**
- [ ] Marker clustering
- [ ] Performance optimizations
- [ ] Visual enhancements
- [ ] Error handling

### **Week 4: Advanced**
- [ ] Heatmap layer
- [ ] Export features
- [ ] Analytics integration
- [ ] Testing and refinement

---

## 🎯 Success Metrics

### **User Experience**
- Map loads in < 2 seconds
- Smooth interactions on mobile
- Intuitive spatial search workflow
- Clear visual hierarchy of risk levels

### **Performance**
- Handle 1000+ markers without lag
- Efficient clustering algorithm
- Optimized bundle size impact
- Fast spatial query responses

### **Feature Adoption**
- % of users who try map view
- Average radius size selected
- Most popular spatial search patterns
- Mobile vs desktop usage

---

## 🔄 Future Enhancements

### **Phase 5: Advanced Analytics** *(Future)*
- Machine learning risk predictions
- Temporal pattern analysis
- Compliance trend forecasting
- Integration with weather/seasonal data

### **Phase 6: Public API** *(Future)*
- RESTful spatial search endpoints
- Rate limiting and authentication
- Developer documentation
- Third-party integrations

---

*Document Status: Draft v1.0*  
*Next Review: After Phase 1 completion*  
*Last Updated: December 2024* 