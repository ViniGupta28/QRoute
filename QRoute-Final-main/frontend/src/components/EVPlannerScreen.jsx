import React, { useState } from 'react';
import { QRouteAPI } from '../services/api';
import { 
  ArrowLeft, 
  Radio, 
  MapPin, 
  ArrowUpDown, 
  Zap, 
  BatteryCharging, 
  Clock, 
  Coffee, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function EVPlannerScreen({ onBack, onStartNavigation }) {
  const [batteryLevel, setBatteryLevel] = useState(47);
  const [includeStops, setIncludeStops] = useState(true);

  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <button onClick={onBack} style={iconHeaderBtnStyle}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
            EV Smart Planner
          </h2>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
            Bhopal Transit Eco Corridor
          </div>
        </div>

        <div style={{
          background: '#DCFCE7',
          color: '#166534',
          fontSize: '10px',
          fontWeight: '800',
          padding: '4px 8px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span className="pulse-dot" style={{ width: '5px', height: '5px' }} />
          TELEMETRY LIVE
        </div>
      </div>

      {/* Route Inputs Card */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00B368' }} />
            <div style={{ width: '2px', height: '28px', background: '#CBD5E1', margin: '2px 0' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#DC2626' }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>FROM</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>MP Nagar Zone 1, Bhopal</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>TO DESTINATION</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>Raja Bhoj International Airport, Bhopal</div>
            </div>
          </div>

          <button style={{ ...iconHeaderBtnStyle, width: '34px', height: '34px' }}>
            <ArrowUpDown size={15} color="#475569" />
          </button>
        </div>

        {/* Route Thumbnail Preview */}
        <div style={{
          marginTop: '12px',
          background: '#E2EEEC',
          borderRadius: '12px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
            ⚡ 17.8 km • ~32 min travel
          </div>
          <span style={{ background: '#0062FF', color: 'white', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
            1 Stop Recommended
          </span>
        </div>
      </div>

      {/* Active EV Profile & Telemetry Card */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{
          background: '#F1F5F9',
          borderRadius: '14px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>ACTIVE EV PROFILE</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>Tata Nexon EV Max (40.5 kWh)</div>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#00B368', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
            Edit
          </button>
        </div>

        {/* Battery Level Display */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>CURRENT BATTERY LEVEL</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', lineHeight: '1.1' }}>
              {batteryLevel}%
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} /> 115 km
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Est. Safe Range</div>
          </div>
        </div>

        {/* Battery Progress Bar Slider */}
        <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ width: `${batteryLevel}%`, height: '100%', background: '#00B368' }} />
        </div>

        <div style={{
          background: '#F8FAFC',
          borderRadius: '10px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#334155',
          border: '1px solid #E2E8F0',
          marginBottom: '12px'
        }}>
          <BatteryCharging size={15} color="#00B368" />
          <span>Port Standard: <strong>CCS-2 Fast Charging Compatible</strong></span>
        </div>

        {/* Toggle Include Charging Stops */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Include Charging Stops</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Maintains a &gt;20% emergency reserve buffer</div>
          </div>
          <input 
            type="checkbox" 
            checked={includeStops} 
            onChange={(e) => setIncludeStops(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: '#015C3B', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Recommended Charging Station Card */}
      <div className="card" style={{ padding: '16px', border: '1.5px solid #00B368' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#015C3B', letterSpacing: '0.4px' }}>
            RECOMMENDED STATION
          </span>
          <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '999px' }}>
            Fast DC 60kW
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
              DB City Mall Charging Hub
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Tata Power EZ Charge • 4.2 km from main axis
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669' }}>
            • 6 of 8 Superchargers Available
          </span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
            ₹18/kWh
          </span>
        </div>

        {/* Charging Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '10px',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Duration</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>+18 min</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Charge Delta</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#059669' }}>20% &rarr; 80%</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Added Range</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>+160 km</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#64748B' }}>
          <span>Amenities:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#334155', fontWeight: '600' }}>
            <Coffee size={13} /> Café
          </span>
          <span style={{ color: '#334155', fontWeight: '600' }}>Restrooms</span>
          <span style={{ color: '#334155', fontWeight: '600' }}>Covered</span>
        </div>
      </div>

      {/* Regenerative Braking Topography Card */}
      <div className="card" style={{ padding: '14px', background: '#F0FDF4', border: '1px solid #DCFCE7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={16} color="#059669" />
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#015C3B' }}>
            Regenerative Braking Topography
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#166534', lineHeight: '1.4' }}>
          VIP Road descent will replenish approximately <strong>3.2% battery pack energy</strong> via downhill kinetic recovery.
        </p>
      </div>

      {/* Find Optimized EV Route Button */}
      <button 
        onClick={async () => {
          await QRouteAPI.calculateEVRoute({
            battery_soc: batteryLevel,
            battery_capacity_kwh: 40.0,
            payload_kg: 180.0
          });
          if (onStartNavigation) {
            onStartNavigation({
              destination: { name: 'Raja Bhoj Airport (EV Fast Hub)', lat: 23.2875, lon: 77.3378 },
              destinationCoords: [23.2875, 77.3378],
              originCoords: [23.2332, 77.4365],
              distance_km: 17.8,
              duration_min: 32,
              via: 'VIP Road & Airport Bypass'
            });
          }
        }}
        className="btn-primary"
        style={{ width: '100%', padding: '16px' }}
      >
        Find Optimized EV Route &rarr;
      </button>
    </div>
  );
}

const iconHeaderBtnStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  background: 'white',
  border: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};
