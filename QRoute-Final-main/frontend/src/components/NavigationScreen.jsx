import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  CornerUpRight, 
  CornerUpLeft,
  ArrowUp,
  Volume2, 
  VolumeX, 
  Compass, 
  Crosshair, 
  X, 
  CheckCircle2, 
  Radio, 
  Navigation as NavIcon,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';

export default function NavigationScreen({ onEndRoute, routeData }) {
  const [muted, setMuted] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(42);
  const [arrived, setArrived] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  // Default Bhopal coordinates if none passed
  const destName = routeData?.destination?.name || routeData?.destination || 'Rani Kamlapati Multimodal Hub';
  const destCoords = routeData?.destination?.lat 
    ? [routeData.destination.lat, routeData.destination.lon]
    : (routeData?.destinationCoords || [23.2180, 77.4400]);

  const originCoords = routeData?.originCoords || [23.2323, 77.4326]; // Board Office Square

  // Navigation waypoint steps
  const navWaypoints = [
    originCoords,
    [23.2310, 77.4345], // Exit Board Office
    [23.2280, 77.4355], // Link Road No. 1 Entry
    [23.2240, 77.4370], // Arera Colony Cut
    [23.2205, 77.4385], // Near Habibganj Flyover
    destCoords           // Destination
  ];

  const maneuvers = [
    { text: 'Head south on Board Office Square', dist: '350 m', icon: 'straight' },
    { text: 'Turn right onto Link Road No. 1', dist: '700 m', icon: 'right' },
    { text: 'Continue straight toward Arera Colony', dist: '1.2 km', icon: 'straight' },
    { text: 'Keep left toward Habibganj Flyover', dist: '900 m', icon: 'left' },
    { text: `Arrive at ${destName}`, dist: '150 m', icon: 'arrive' }
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: originCoords,
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      // Free OpenStreetMap Standard Tiles (No API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Route polyline (Bright blue navigation route with white outline)
      L.polyline(navWaypoints, {
        color: '#1E40AF',
        weight: 9,
        opacity: 0.6
      }).addTo(map);

      routeLineRef.current = L.polyline(navWaypoints, {
        color: '#0062FF',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Start origin pin
      const startIcon = L.divIcon({
        className: 'bhopal-marker-icon',
        html: `<div style="background: #00B368; color: white; padding: 4px 8px; border-radius: 999px; font-size: 10px; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">📍 Start</div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });
      L.marker(originCoords, { icon: startIcon }).addTo(map);

      // Destination pin
      const destIcon = L.divIcon({
        className: 'bhopal-marker-icon',
        html: `<div style="background: #DC2626; color: white; padding: 4px 8px; border-radius: 999px; font-size: 10px; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🏁 ${destName.split(' ')[0]}</div>`,
        iconSize: [80, 24],
        iconAnchor: [40, 12]
      });
      L.marker(destCoords, { icon: destIcon }).addTo(map);

      // Moving Vehicle Navigation Puck
      const vehicleIcon = L.divIcon({
        className: 'bhopal-marker-icon',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(0, 179, 104, 0.25); animation: pulse 2s infinite;"></div>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #015C3B; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
              <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 11px solid white; transform: rotate(15deg);"></div>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      vehicleMarkerRef.current = L.marker(originCoords, { icon: vehicleIcon }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Simulated progress along route
    const interval = setInterval(() => {
      setCurrentStepIdx(prev => {
        const next = prev + 1;
        if (next < navWaypoints.length) {
          const pt = navWaypoints[next];
          if (vehicleMarkerRef.current && mapInstanceRef.current) {
            vehicleMarkerRef.current.setLatLng(pt);
            mapInstanceRef.current.panTo(pt, { animate: true, duration: 1.5 });
          }
          // Slight speed fluctuation
          setCurrentSpeed(Math.floor(38 + Math.random() * 8));
          return next;
        } else {
          setArrived(true);
          return prev;
        }
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [destName]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && vehicleMarkerRef.current) {
      const pos = vehicleMarkerRef.current.getLatLng();
      mapInstanceRef.current.flyTo(pos, 16, { duration: 1 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const currentManeuver = maneuvers[Math.min(currentStepIdx, maneuvers.length - 1)];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F1F5F9' }}>
      {/* 1. Full-Screen Interactive Leaflet Navigation Map */}
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} 
      />

      {/* 2. Top Speed Limit & GPS Accuracy Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        right: '14px',
        zIndex: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Speed Limit Sign */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'white',
          border: '3.5px solid #EF4444',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <span style={{ fontSize: '9px', fontWeight: '800', color: '#64748B', lineHeight: '1' }}>50</span>
          <span style={{ fontSize: '7px', fontWeight: '800', color: '#EF4444', lineHeight: '1' }}>KM/H</span>
        </div>

        {/* GPS Connected & Accuracy Badges */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#0F172A',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00B368' }} />
            GPS Live
          </div>

          <div style={{
            background: '#A7F3D0',
            color: '#065F46',
            borderRadius: '9999px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            HIGH ACCURACY
          </div>
        </div>
      </div>

      {/* 3. Main Maneuver Turn Instruction Banner (Dark Emerald Green) */}
      <div style={{
        position: 'absolute',
        top: '68px',
        left: '14px',
        right: '14px',
        zIndex: 30,
        background: '#015C3B',
        borderRadius: '20px',
        padding: '16px',
        color: 'white',
        boxShadow: '0 10px 25px rgba(1, 92, 59, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {currentManeuver.icon === 'right' ? (
              <CornerUpRight size={28} color="#FFFFFF" strokeWidth={2.5} />
            ) : currentManeuver.icon === 'left' ? (
              <CornerUpLeft size={28} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <ArrowUp size={28} color="#FFFFFF" strokeWidth={2.5} />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>
                In {currentManeuver.dist}
              </div>
              <button 
                onClick={() => setMuted(!muted)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '2px' }}
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
            
            <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '2px', lineHeight: '1.2' }}>
              {currentManeuver.text}
            </div>
          </div>
        </div>

        {/* Sub-instruction footer */}
        <div style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
            Then: <ArrowUp size={12} /> Continue to {destName}
          </span>
          <span style={{
            background: '#00B368',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: '800'
          }}>
            Optimal
          </span>
        </div>
      </div>

      {/* 4. Floating Right Controls */}
      <div style={{
        position: 'absolute',
        bottom: '220px',
        right: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 20
      }}>
        <button onClick={handleZoomIn} style={navCircleBtnStyle} title="Zoom In">
          <Plus size={18} color="#1E293B" />
        </button>
        <button onClick={handleZoomOut} style={navCircleBtnStyle} title="Zoom Out">
          <Minus size={18} color="#1E293B" />
        </button>
        <button onClick={handleRecenter} style={{ ...navCircleBtnStyle, background: '#015C3B', color: 'white' }} title="Recenter on Vehicle">
          <Crosshair size={18} color="#FFFFFF" />
        </button>
      </div>

      {/* 5. Floating Bottom Navigation HUD */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#FFFFFF',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '16px 18px 24px',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
        zIndex: 35
      }}>
        {/* Next Corridor chip */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>
              Bhopal Smart Corridor • Live Link Rd
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
            Flow Optimum (0 Delay)
          </span>
        </div>

        {/* ETA, Distance, Speed Metrics */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A' }}>
                {Math.max(1, 14 - currentStepIdx * 3)}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748B' }}>min</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
              {(Math.max(0.3, (4.8 - currentStepIdx * 0.9))).toFixed(1)} km remaining
            </div>
          </div>

          {/* Speed Puck */}
          <div style={{
            background: '#F1F5F9',
            borderRadius: '14px',
            padding: '6px 14px',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#015C3B' }}>
              {currentSpeed}
            </div>
            <div style={{ fontSize: '9px', fontWeight: '800', color: '#64748B' }}>KM/H</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
              11:15 PM
            </div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
              🌱 18% CO₂ Saved
            </div>
          </div>
        </div>

        {/* Action Buttons: End Route & Search on Route */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onEndRoute}
            style={{
              flex: 1,
              background: '#FEE2E2',
              color: '#DC2626',
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
            <X size={16} />
            End Navigation
          </button>

          <button 
            onClick={handleRecenter}
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
              boxShadow: '0 4px 12px rgba(1, 92, 59, 0.25)'
            }}
          >
            <NavIcon size={16} />
            Recenter View
          </button>
        </div>
      </div>
    </div>
  );
}

const navCircleBtnStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'white',
  border: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
};
