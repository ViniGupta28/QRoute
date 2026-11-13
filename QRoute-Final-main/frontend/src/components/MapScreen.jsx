import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { QRouteAPI } from '../services/api';
import { 
  Search, 
  Mic, 
  SlidersHorizontal, 
  Zap, 
  Bus, 
  Train, 
  Layers, 
  Compass, 
  Navigation, 
  Crosshair, 
  Wind, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  MapPin, 
  Plus, 
  Minus,
  Map as MapIcon,
  X,
  ArrowRight,
  Clock,
  Route
} from 'lucide-react';

const BHOPAL_HUBS = [
  {
    id: 'rk-hub',
    name: 'Rani Kamlapati Multimodal Transit Hub',
    shortName: 'Rani Kamlapati',
    category: 'metro',
    lat: 23.2180,
    lon: 77.4400,
    emoji: '🚉',
    color: '#015C3B',
    occupancy: '42%',
    distance: '2.4 km away',
    details: 'Habibganj Multimodal Terminal • Metro Line-1 Platform 2'
  },
  {
    id: 'board-office',
    name: 'Board Office Central Square Hub',
    shortName: 'Board Office',
    category: 'buses',
    lat: 23.2323,
    lon: 77.4326,
    emoji: '🏛️',
    color: '#2563EB',
    occupancy: '68%',
    distance: '0.8 km away',
    details: 'BRTS Central Transfer Station • 14 Transit Lines'
  },
  {
    id: 'mp-nagar',
    name: 'MP Nagar Zone 1 Commercial Center',
    shortName: 'MP Nagar',
    category: 'buses',
    lat: 23.2332,
    lon: 77.4365,
    emoji: '🏢',
    color: '#3B82F6',
    occupancy: '75%',
    distance: '1.1 km away',
    details: 'City Center Bus Junction & Smart Parking'
  },
  {
    id: 'new-market',
    name: 'New Market Retail & Transit Terminal',
    shortName: 'New Market',
    category: 'buses',
    lat: 23.2366,
    lon: 77.4012,
    emoji: '🛍️',
    color: '#D97706',
    occupancy: '58%',
    distance: '3.6 km away',
    details: 'Historic Market Transfer Terminal • TT Nagar Ring'
  },
  {
    id: 'hamidia-hospital',
    name: 'Hamidia Hospital Logistics & Health Depot',
    shortName: 'Hamidia Hospital',
    category: 'buses',
    lat: 23.2599,
    lon: 77.4126,
    emoji: '🏥',
    color: '#DC2626',
    occupancy: '30%',
    distance: '4.8 km away',
    details: 'Primary Medical Transit Hub & Emergency Depot'
  },
  {
    id: 'bhopal-junction',
    name: 'Bhopal Junction Main Railway Station',
    shortName: 'Bhopal Junction',
    category: 'metro',
    lat: 23.2678,
    lon: 77.4145,
    emoji: '🚆',
    color: '#7C3AED',
    occupancy: '82%',
    distance: '5.2 km away',
    details: 'Northern Rail Terminal & City Bus Feeder'
  },
  {
    id: 'ev-db-city',
    name: 'DB City Mall Fast Charging Station',
    shortName: 'DB City EV',
    category: 'ev',
    lat: 23.2340,
    lon: 77.4350,
    emoji: '⚡',
    color: '#059669',
    occupancy: '3/4 Free',
    distance: '1.0 km away',
    details: '60 kW Fast CCS2 & Type-2 Chargers'
  },
  {
    id: 'ev-mp-nagar',
    name: 'MP Nagar Super Fast EV Hub',
    shortName: 'MP Nagar EV',
    category: 'ev',
    lat: 23.2310,
    lon: 77.4380,
    emoji: '⚡',
    color: '#059669',
    occupancy: '2/2 Free',
    distance: '1.3 km away',
    details: '120 kW DC Fast Dual Guns'
  },
  {
    id: 'bus-tr1',
    name: 'Live BRTS City Bus TR-1',
    shortName: 'BRTS TR-1 (Live)',
    category: 'buses',
    lat: 23.2450,
    lon: 77.4200,
    emoji: '🚌',
    color: '#00B368',
    occupancy: '52%',
    distance: 'Approaching in 2m',
    details: 'Habibganj -> Board Office -> Hamidia Corridor'
  }
];

export default function MapScreen({ onNavigate, onStartNavigation }) {
  const [activeLayer, setActiveLayer] = useState('all');
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [selectedHub, setSelectedHub] = useState(BHOPAL_HUBS[0]);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'schematic'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Directions state
  const [activeDirections, setActiveDirections] = useState(null);
  const [loadingDirections, setLoadingDirections] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const directionLineRef = useRef(null);
  const startMarkerRef = useRef(null);

  // Initialize and manage Leaflet Map with 100% Free OpenStreetMap Tiles
  useEffect(() => {
    if (viewMode !== 'interactive' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.2323, 77.4326], // Board Office Bhopal center
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // 100% Free OpenStreetMap Standard Tiles (NO API KEY REQUIRED)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Bhopal BRTS Trunk Corridor Polyline (Blue)
      const brtsCoords = [
        [23.2180, 77.4400],
        [23.2280, 77.4340],
        [23.2323, 77.4326],
        [23.2332, 77.4365],
        [23.2450, 77.4200],
        [23.2599, 77.4126]
      ];
      L.polyline(brtsCoords, {
        color: '#2563EB',
        weight: 4,
        opacity: 0.75,
        dashArray: '6, 6'
      }).addTo(map);

      // Metro Line-1 Corridor Polyline (Green)
      const metroCoords = [
        [23.2180, 77.4400],
        [23.2332, 77.4365],
        [23.2500, 77.4200],
        [23.2678, 77.4145]
      ];
      L.polyline(metroCoords, {
        color: '#00B368',
        weight: 3.5,
        opacity: 0.8
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Filter hubs based on layer
    const filteredHubs = BHOPAL_HUBS.filter(hub => {
      if (activeLayer === 'all') return true;
      if (activeLayer === 'ev') return hub.category === 'ev';
      if (activeLayer === 'buses') return hub.category === 'buses';
      if (activeLayer === 'metro') return hub.category === 'metro';
      return true;
    });

    // Add markers
    filteredHubs.forEach(hub => {
      const isSelected = selectedHub && selectedHub.id === hub.id;
      const customIcon = L.divIcon({
        className: 'bhopal-marker-icon',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: ${hub.color};
            color: white;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 3px 10px rgba(0,0,0,0.25);
            border: ${isSelected ? '3px solid #FCD34D' : '2px solid white'};
            transform: scale(${isSelected ? '1.15' : '1.0'});
            transition: transform 0.15s ease;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>${hub.emoji}</span>
            <span>${hub.shortName}</span>
          </div>
        `,
        iconSize: [90, 32],
        iconAnchor: [45, 16]
      });

      const marker = L.marker([hub.lat, hub.lon], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedHub(hub);
        setSheetExpanded(true);
      });
      markersRef.current.push(marker);
    });

  }, [viewMode, activeLayer, selectedHub]);

  // Compute and show live directions on map
  const handleShowDirections = async (destHub = selectedHub) => {
    if (!destHub) return;
    setLoadingDirections(true);
    try {
      const originLat = 23.2323; // Board Office Central Hub
      const originLon = 77.4326;

      // Plan route via QRouteAPI
      const res = await QRouteAPI.planRoute({
        origin: { lat: originLat, lon: originLon },
        destination: { lat: destHub.lat, lon: destHub.lon },
        mode: 'car'
      });

      const routeData = res.data || {};
      const distance = routeData.distance_km || 3.8;
      const duration = routeData.duration_minutes || 11;

      // Build coordinates sequence
      let coords = [];
      if (routeData.geometry?.features?.[0]?.geometry?.coordinates) {
        coords = routeData.geometry.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
      } else {
        coords = [
          [originLat, originLon],
          [(originLat * 0.6 + destHub.lat * 0.4), (originLon * 0.6 + destHub.lon * 0.4)],
          [(originLat * 0.3 + destHub.lat * 0.7), (originLon * 0.3 + destHub.lon * 0.7)],
          [destHub.lat, destHub.lon]
        ];
      }

      setActiveDirections({
        destination: destHub,
        distance_km: distance,
        duration_min: Math.round(duration),
        coordinates: coords,
        via: destHub.id === 'rk-hub' ? 'Link Road No. 1' : 'Main Bhopal Arterial'
      });

      // Plot route on Leaflet Map
      if (mapInstanceRef.current && coords.length > 0) {
        if (directionLineRef.current) {
          mapInstanceRef.current.removeLayer(directionLineRef.current);
        }
        if (startMarkerRef.current) {
          mapInstanceRef.current.removeLayer(startMarkerRef.current);
        }

        // Blue driving polyline
        directionLineRef.current = L.polyline(coords, {
          color: '#0062FF',
          weight: 6,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstanceRef.current);

        // Start origin marker
        const startIcon = L.divIcon({
          className: 'bhopal-marker-icon',
          html: `<div style="background: #00B368; color: white; padding: 4px 8px; border-radius: 999px; font-size: 10px; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">📍 Board Office</div>`,
          iconSize: [80, 26],
          iconAnchor: [40, 13]
        });
        startMarkerRef.current = L.marker([originLat, originLon], { icon: startIcon }).addTo(mapInstanceRef.current);

        // Fit map viewport to the planned route
        mapInstanceRef.current.fitBounds(directionLineRef.current.getBounds(), {
          padding: [80, 80]
        });
      }
    } catch (err) {
      console.error('Error calculating directions:', err);
    } finally {
      setLoadingDirections(false);
    }
  };

  const handleClearDirections = () => {
    if (mapInstanceRef.current) {
      if (directionLineRef.current) {
        mapInstanceRef.current.removeLayer(directionLineRef.current);
        directionLineRef.current = null;
      }
      if (startMarkerRef.current) {
        mapInstanceRef.current.removeLayer(startMarkerRef.current);
        startMarkerRef.current = null;
      }
      mapInstanceRef.current.flyTo([23.2323, 77.4326], 13);
    }
    setActiveDirections(null);
  };

  const handleLocateMe = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([23.2323, 77.4326], 14, { duration: 1 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Top Floating Search and Filter Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        right: '14px',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Search bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E2E8F0'
        }}>
          <Search size={18} color="#00B368" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bhopal stations, EV chargers, bus stops..." 
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: '500',
              flex: 1,
              color: '#0F172A'
            }}
          />
          <Mic size={17} color="#64748B" style={{ cursor: 'pointer' }} />
          <div style={{ width: '1px', height: '18px', background: '#CBD5E1' }} />
          
          {/* Map view mode toggle button */}
          <button 
            onClick={() => setViewMode(viewMode === 'interactive' ? 'schematic' : 'interactive')}
            style={{
              background: viewMode === 'interactive' ? '#E8F8F0' : '#EFF6FF',
              color: viewMode === 'interactive' ? '#015C3B' : '#2563EB',
              border: 'none',
              borderRadius: '999px',
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Switch between Live Real Map & Schematic View"
          >
            <MapIcon size={12} />
            <span>{viewMode === 'interactive' ? 'OSM Map' : 'Schematic'}</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none'
        }}>
          <button 
            onClick={() => setActiveLayer('all')}
            style={{
              ...filterPillStyle,
              background: activeLayer === 'all' ? '#015C3B' : 'white',
              color: activeLayer === 'all' ? 'white' : '#1E293B',
              border: activeLayer === 'all' ? 'none' : '1px solid #E2E8F0'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeLayer === 'all' ? '#34D399' : '#00B368' }} />
            All Layers
          </button>

          <button 
            onClick={() => setActiveLayer('ev')}
            style={{
              ...filterPillStyle,
              background: activeLayer === 'ev' ? '#015C3B' : 'white',
              color: activeLayer === 'ev' ? 'white' : '#1E293B',
              border: activeLayer === 'ev' ? 'none' : '1px solid #E2E8F0'
            }}
          >
            <Zap size={14} color={activeLayer === 'ev' ? '#34D399' : '#059669'} />
            EV Chargers <span style={{ background: '#E8F8F0', color: '#015C3B', padding: '1px 6px', borderRadius: '999px', fontSize: '10px' }}>18</span>
          </button>

          <button 
            onClick={() => setActiveLayer('buses')}
            style={{
              ...filterPillStyle,
              background: activeLayer === 'buses' ? '#015C3B' : 'white',
              color: activeLayer === 'buses' ? 'white' : '#1E293B',
              border: activeLayer === 'buses' ? 'none' : '1px solid #E2E8F0'
            }}
          >
            <Bus size={14} color={activeLayer === 'buses' ? '#34D399' : '#2563EB'} />
            Live Buses
          </button>

          <button 
            onClick={() => setActiveLayer('metro')}
            style={{
              ...filterPillStyle,
              background: activeLayer === 'metro' ? '#015C3B' : 'white',
              color: activeLayer === 'metro' ? 'white' : '#1E293B',
              border: activeLayer === 'metro' ? 'none' : '1px solid #E2E8F0'
            }}
          >
            <Train size={14} color={activeLayer === 'metro' ? '#34D399' : '#7C3AED'} />
            Metro Line-1
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      {viewMode === 'interactive' ? (
        /* Real Interactive Free OpenStreetMap Container */
        <div 
          ref={mapContainerRef} 
          style={{ width: '100%', height: '100%', background: '#F1F5F9', zIndex: 1 }} 
        />
      ) : (
        /* Stylized Transit Schematic Vector Canvas */
        <div style={{
          width: '100%',
          height: '100%',
          background: '#E2EEEC',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <svg viewBox="0 0 430 800" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path 
              d="M -20 220 C 60 210, 110 240, 130 290 C 140 330, 90 380, 40 420 C 10 440, -30 430, -30 220 Z" 
              fill="#B8DCE7" 
              stroke="#9BC8D6" 
              strokeWidth="2"
            />
            <text x="35" y="320" fill="#3B82F6" fontSize="11" fontWeight="700" opacity="0.8">Upper Lake</text>
            <text x="35" y="334" fill="#3B82F6" fontSize="9" opacity="0.7">(Bhojtal)</text>

            <path 
              d="M 120 370 C 150 365, 175 385, 170 410 C 160 425, 130 420, 120 370 Z" 
              fill="#B8DCE7" 
              stroke="#9BC8D6" 
              strokeWidth="1.5"
            />

            <path d="M 10 430 C 50 420, 90 440, 75 490 C 50 520, 10 500, 10 430 Z" fill="#D5E8D4" opacity="0.8" />
            <text x="25" y="470" fill="#15803D" fontSize="9" fontWeight="600">Van Vihar</text>

            <path d="M 0 160 L 430 190" stroke="#CBD5E1" strokeWidth="3" fill="none" />
            <path d="M 220 0 L 260 800" stroke="#CBD5E1" strokeWidth="4" fill="none" />
            <path d="M 0 520 Q 200 480, 430 550" stroke="#CBD5E1" strokeWidth="3" fill="none" />

            <path 
              d="M 240 100 L 210 240 L 205 320 L 230 440 L 215 560 L 220 720" 
              stroke="#2563EB" 
              strokeWidth="6" 
              strokeDasharray="6,4"
              fill="none" 
              opacity="0.85"
            />
            <path d="M 250 140 L 235 280 L 245 420 L 250 560" stroke="#00B368" strokeWidth="3.5" fill="none" />

            <text x="140" y="275" fill="#475569" fontSize="11" fontWeight="700">Old Bhopal</text>
            <text x="270" y="240" fill="#1E293B" fontSize="13" fontWeight="800">MP Nagar</text>
            <text x="260" y="360" fill="#475569" fontSize="11" fontWeight="700">Arera Colony</text>
            <text x="240" y="525" fill="#1E293B" fontSize="13" fontWeight="800">Rani Kamlapati Hub</text>

            <g transform="translate(195, 290)">
              <rect x="0" y="0" width="82" height="26" rx="13" fill="#00B368" />
              <text x="12" y="17" fill="white" fontSize="12" fontWeight="800">🚌 TR-1</text>
            </g>
          </svg>
        </div>
      )}

      {/* Floating Speed Limit & Flow Chip */}
      <div style={{
        position: 'absolute',
        top: '98px',
        left: '14px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E2E8F0',
        zIndex: 20
      }}>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          border: '2.5px solid #EF4444',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white'
        }}>
          <span style={{ fontSize: '7px', fontWeight: '800', color: '#64748B', lineHeight: '1' }}>LIMIT</span>
          <span style={{ fontSize: '10px', fontWeight: '900', color: '#1E293B', lineHeight: '1' }}>50</span>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
            38 <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>km/h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', color: '#059669' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }} />
            Flow Optimum
          </div>
        </div>
      </div>

      {/* Floating Right Map Control Buttons */}
      <div style={{
        position: 'absolute',
        bottom: activeDirections ? '190px' : (sheetExpanded ? '310px' : '90px'),
        right: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 20,
        transition: 'bottom 0.3s ease'
      }}>
        {viewMode === 'interactive' && (
          <>
            <button onClick={handleZoomIn} style={mapControlBtnStyle} title="Zoom In">
              <Plus size={18} color="#1E293B" />
            </button>
            <button onClick={handleZoomOut} style={mapControlBtnStyle} title="Zoom Out">
              <Minus size={18} color="#1E293B" />
            </button>
          </>
        )}
        <button 
          onClick={handleLocateMe} 
          style={{ ...mapControlBtnStyle, background: '#015C3B', color: 'white' }} 
          title="Locate Bhopal Center"
        >
          <Crosshair size={18} color="#FFFFFF" />
        </button>
      </div>

      {/* ACTIVE DIRECTIONS OVERLAY CARD (Shown when Directions are active) */}
      {activeDirections ? (
        <div style={{
          position: 'absolute',
          bottom: '72px',
          left: '12px',
          right: '12px',
          background: 'white',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          zIndex: 35,
          border: '1px solid #E2E8F0',
          animation: 'slideUpToast 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Route size={18} color="#0062FF" />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>DIRECTIONS TO</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                  {activeDirections.destination.name}
                </div>
              </div>
            </div>
            <button 
              onClick={handleClearDirections}
              style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={15} color="#475569" />
            </button>
          </div>

          {/* Metrics Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#00B368" />
              <span style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A' }}>
                {activeDirections.duration_min} min
              </span>
            </div>
            <div style={{ width: '1px', height: '16px', background: '#CBD5E1' }} />
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>
              {activeDirections.distance_km} km
            </div>
            <div style={{ width: '1px', height: '16px', background: '#CBD5E1' }} />
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
              🌱 Fast Corridor
            </div>
          </div>

          {/* Start Turn-by-Turn Button */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                const navData = activeDirections || {
                  destination: selectedHub,
                  destinationCoords: [selectedHub.lat, selectedHub.lon],
                  originCoords: [23.2323, 77.4326],
                  distance_km: 3.8,
                  duration_min: 11,
                  via: 'Link Road No. 1'
                };
                if (onStartNavigation) {
                  onStartNavigation(navData);
                } else if (onNavigate) {
                  onNavigate('navigate');
                }
              }}
              style={{
                flex: 1,
                background: '#015C3B',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(1, 92, 59, 0.25)'
              }}
            >
              <Navigation size={16} />
              Start Navigation
            </button>

            <button
              onClick={() => onNavigate('plan')}
              style={{
                background: '#F1F5F9',
                color: '#1E293B',
                border: 'none',
                borderRadius: '999px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Options
            </button>
          </div>
        </div>
      ) : (
        /* Slide-Up Multimodal Transit Bottom Sheet Drawer */
        <div style={{
          position: 'absolute',
          bottom: '68px',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '12px 16px 16px',
          boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.12)',
          zIndex: 25,
          transform: sheetExpanded ? 'translateY(0)' : 'translateY(calc(100% - 46px))',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          borderTop: '1px solid #E2E8F0'
        }}>
          {/* Drag Handle Bar */}
          <div 
            onClick={() => setSheetExpanded(!sheetExpanded)}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', paddingBottom: '6px' }}
          >
            <div style={{ width: '38px', height: '4px', borderRadius: '2px', background: '#CBD5E1', marginBottom: '4px' }} />
            {sheetExpanded ? <ChevronDown size={14} color="#94A3B8" /> : <ChevronUp size={14} color="#94A3B8" />}
          </div>

          {/* Selected Hub Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  background: '#E8F8F0',
                  color: '#015C3B',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  letterSpacing: '0.4px'
                }}>
                  {selectedHub.category.toUpperCase()} TERMINAL
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                  {selectedHub.distance}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
                {selectedHub.name}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                {selectedHub.details}
              </div>
            </div>

            <div style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              padding: '6px 10px',
              textAlign: 'right',
              border: '1px solid #E2E8F0',
              flexShrink: 0
            }}>
              <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Occupancy</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                {selectedHub.occupancy}
              </div>
              <div style={{ fontSize: '8px', color: '#64748B' }}>Live Status</div>
            </div>
          </div>

          {/* 3 Sub-Services Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
            <div style={subServiceCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Train size={16} color="#2563EB" />
                <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '9px', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                  Plat 2
                </span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>Metro Line-1</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563EB' }}>in 4m</div>
            </div>

            <div style={subServiceCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Zap size={16} color="#059669" />
                <span style={{ background: '#E8F8F0', color: '#015C3B', fontSize: '9px', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                  60kW
                </span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>Fast EV Port</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#059669' }}>6/8 free</div>
            </div>

            <div style={subServiceCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Bus size={16} color="#475569" />
                <span style={{ background: '#F1F5F9', color: '#334155', fontSize: '9px', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                  BRTS
                </span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>City Buses</div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#475569' }}>TR-1 • Next</div>
            </div>
          </div>

          {/* Action Buttons: Directions & Plan Trip */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => handleShowDirections(selectedHub)}
              disabled={loadingDirections}
              style={{
                flex: 1.2,
                background: '#015C3B',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(1, 92, 59, 0.25)',
                opacity: loadingDirections ? 0.8 : 1
              }}
            >
              {loadingDirections ? (
                <><span className="qr-spinner" /> Routing...</>
              ) : (
                <><Navigation size={16} /> Show Directions</>
              )}
            </button>

            <button 
              onClick={() => onNavigate('plan')}
              style={{
                flex: 1,
                background: '#F1F5F9',
                color: '#1E293B',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Compass size={16} color="#475569" />
              Plan Trip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const filterPillStyle = {
  padding: '6px 14px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '700',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  transition: 'all 0.15s ease'
};

const mapControlBtnStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  background: 'white',
  border: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const subServiceCardStyle = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '8px 10px'
};
