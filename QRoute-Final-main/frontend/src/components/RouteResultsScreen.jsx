import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  ArrowLeft, 
  Layers, 
  Sparkles, 
  Leaf, 
  Zap, 
  Clock, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  Info, 
  ChevronRight,
  Footprints,
  Compass
} from 'lucide-react';

export default function RouteResultsScreen({ onBack, onStartNavigation }) {
  const [selectedRoute, setSelectedRoute] = useState('recommended');
  const [activeTab, setActiveTab] = useState('fastest');
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylinesRef = useRef({});

  // 3 Alternative Bhopal Routes
  const routesData = {
    recommended: {
      id: 'recommended',
      name: 'AI Smart Flow (Recommended)',
      color: '#0062FF',
      time: '24 min',
      timeMin: 24,
      dist: '7.4 km',
      distKm: 7.4,
      co2: '-18%',
      via: 'Link Road No. 1 & Chetak Bridge',
      coords: [
        [23.2323, 77.4326], // Board Office
        [23.2310, 77.4345],
        [23.2280, 77.4355],
        [23.2240, 77.4370],
        [23.2180, 77.4400]  // Rani Kamlapati
      ]
    },
    eco: {
      id: 'eco',
      name: 'Eco Transit Priority',
      color: '#059669',
      time: '28 min',
      timeMin: 28,
      dist: '6.8 km',
      distKm: 6.8,
      co2: '-34%',
      via: 'BRTS Dedicated Busway',
      coords: [
        [23.2323, 77.4326],
        [23.2290, 77.4310],
        [23.2230, 77.4330],
        [23.2180, 77.4400]
      ]
    },
    toll: {
      id: 'toll',
      name: 'Express Bypass',
      color: '#DC2626',
      time: '21 min',
      timeMin: 21,
      dist: '9.2 km',
      distKm: 9.2,
      co2: '+5%',
      via: 'Hoshangabad Elevated Corridor',
      coords: [
        [23.2323, 77.4326],
        [23.2360, 77.4420],
        [23.2280, 77.4460],
        [23.2180, 77.4400]
      ]
    }
  };

  // Initialize and update Leaflet Route Preview Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.2250, 77.4360],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Free OpenStreetMap Standard Tiles (No API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Start origin pin
      const startIcon = L.divIcon({
        className: 'bhopal-marker-icon',
        html: `<div style="background: #00B368; color: white; padding: 2px 6px; border-radius: 999px; font-size: 9px; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍 Start</div>`,
        iconSize: [50, 20],
        iconAnchor: [25, 10]
      });
      L.marker([23.2323, 77.4326], { icon: startIcon }).addTo(map);

      // End destination pin
      const destIcon = L.divIcon({
        className: 'bhopal-marker-icon',
        html: `<div style="background: #DC2626; color: white; padding: 2px 6px; border-radius: 999px; font-size: 9px; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏁 Terminal</div>`,
        iconSize: [60, 20],
        iconAnchor: [30, 10]
      });
      L.marker([23.2180, 77.4400], { icon: destIcon }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // Draw lines with active highlight
    Object.values(routesData).forEach(r => {
      const isSelected = selectedRoute === r.id;
      if (polylinesRef.current[r.id]) {
        map.removeLayer(polylinesRef.current[r.id]);
      }

      polylinesRef.current[r.id] = L.polyline(r.coords, {
        color: r.color,
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.95 : 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      if (isSelected) {
        polylinesRef.current[r.id].bringToFront();
      }
    });

  }, [selectedRoute]);

  const activeRouteData = routesData[selectedRoute] || routesData.recommended;

  const handleStartNav = () => {
    if (onStartNavigation) {
      onStartNavigation({
        destination: { name: 'Rani Kamlapati Multimodal Hub', lat: 23.2180, lon: 77.4400 },
        destinationCoords: [23.2180, 77.4400],
        originCoords: [23.2323, 77.4326],
        distance_km: activeRouteData.distKm,
        duration_min: activeRouteData.timeMin,
        via: activeRouteData.via
      });
    }
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <button 
          onClick={onBack}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} color="#0F172A" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
            Route Results
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', color: '#059669', fontWeight: '700' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }} />
            Bhopal Smart Transit
          </div>
        </div>

        <span style={{
          background: '#EFF6FF',
          color: '#2563EB',
          fontSize: '10px',
          fontWeight: '800',
          padding: '4px 8px',
          borderRadius: '999px'
        }}>
          3 Routes
        </span>
      </div>

      {/* Real Interactive Leaflet Mini Map Viewport */}
      <div style={{
        height: '190px',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
        border: '1px solid #CBD5E1',
        marginTop: '6px'
      }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Labels over map */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
          borderRadius: '8px',
          padding: '3px 8px',
          fontSize: '10px',
          fontWeight: '800',
          color: '#0F172A',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          📍 Board Office
        </div>

        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
          borderRadius: '8px',
          padding: '3px 8px',
          fontSize: '10px',
          fontWeight: '800',
          color: '#015C3B',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          🏁 Rani Kamlapati
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: '#F1F5F9',
        borderRadius: '12px',
        padding: '4px',
        marginTop: '12px'
      }}>
        <button
          onClick={() => { setActiveTab('fastest'); setSelectedRoute('recommended'); }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'fastest' ? 'white' : 'transparent',
            color: activeTab === 'fastest' ? '#0F172A' : '#64748B',
            fontSize: '12px',
            fontWeight: '700',
            boxShadow: activeTab === 'fastest' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer'
          }}
        >
          ⚡ Fastest
        </button>
        <button
          onClick={() => { setActiveTab('eco'); setSelectedRoute('eco'); }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'eco' ? 'white' : 'transparent',
            color: activeTab === 'eco' ? '#059669' : '#64748B',
            fontSize: '12px',
            fontWeight: '700',
            boxShadow: activeTab === 'eco' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer'
          }}
        >
          🌱 Eco-Transit
        </button>
        <button
          onClick={() => { setActiveTab('express'); setSelectedRoute('toll'); }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'express' ? 'white' : 'transparent',
            color: activeTab === 'express' ? '#DC2626' : '#64748B',
            fontSize: '12px',
            fontWeight: '700',
            boxShadow: activeTab === 'express' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer'
          }}
        >
          🛣️ Express Bypass
        </button>
      </div>

      {/* Route Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
        {/* Route 1: Recommended */}
        <div 
          onClick={() => setSelectedRoute('recommended')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '14px 16px',
            border: selectedRoute === 'recommended' ? '2px solid #0062FF' : '1px solid #E2E8F0',
            boxShadow: selectedRoute === 'recommended' ? '0 4px 14px rgba(0, 98, 255, 0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{
              background: '#EFF6FF',
              color: '#0062FF',
              fontSize: '10px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={11} /> AI RECOMMENDED
            </span>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
              🌱 -18% CO₂
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A' }}>24 min</span>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginLeft: '8px' }}>7.4 km</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0062FF' }}>
              {selectedRoute === 'recommended' ? '✓ Selected' : 'Select'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            via Link Road No. 1 • Chetak Bridge • Flow Optimum
          </div>
        </div>

        {/* Route 2: Eco-Transit */}
        <div 
          onClick={() => setSelectedRoute('eco')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '14px 16px',
            border: selectedRoute === 'eco' ? '2px solid #059669' : '1px solid #E2E8F0',
            boxShadow: selectedRoute === 'eco' ? '0 4px 14px rgba(5, 150, 105, 0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{
              background: '#DCFCE7',
              color: '#166534',
              fontSize: '10px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Leaf size={11} /> BRTS TRANSIT PRIORITY
            </span>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: '800' }}>
              🌱 -34% CO₂
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A' }}>28 min</span>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginLeft: '8px' }}>6.8 km</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>
              {selectedRoute === 'eco' ? '✓ Selected' : 'Select'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            via Dedicated BRTS Bus Lane • Zero traffic slowdown
          </div>
        </div>

        {/* Route 3: Express Bypass */}
        <div 
          onClick={() => setSelectedRoute('toll')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '14px 16px',
            border: selectedRoute === 'toll' ? '2px solid #DC2626' : '1px solid #E2E8F0',
            boxShadow: selectedRoute === 'toll' ? '0 4px 14px rgba(220, 38, 38, 0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{
              background: '#FEE2E2',
              color: '#991B1B',
              fontSize: '10px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '999px'
            }}>
              EXPRESS BYPASS
            </span>
            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: '600' }}>
              +1.8 km extra
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A' }}>21 min</span>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginLeft: '8px' }}>9.2 km</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#DC2626' }}>
              {selectedRoute === 'toll' ? '✓ Selected' : 'Select'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            via Hoshangabad Elevated Road • Minimal traffic lights
          </div>
        </div>
      </div>

      {/* Start Navigation CTA */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button
          onClick={handleStartNav}
          className="btn-primary-green"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '15px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 6px 18px rgba(0, 179, 104, 0.35)'
          }}
        >
          <Navigation size={18} />
          <span>Start Navigation &rarr;</span>
        </button>
      </div>
    </div>
  );
}
