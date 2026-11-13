import React, { useState } from 'react';
import { QRouteAPI } from '../services/api';
import { 
  ArrowLeft, 
  RotateCw, 
  MapPin, 
  Minus, 
  Plus, 
  SlidersHorizontal, 
  PlusCircle, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Leaf,
  Layers
} from 'lucide-react';

export default function FleetOptimizationScreen({ onBack, onNavigate, showToast }) {
  const [fleetSize, setFleetSize] = useState(3);
  const [optimized, setOptimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <button onClick={onBack} style={iconHeaderBtnStyle}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
            Delivery Optimization
          </h2>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
            Bhopal East-West Logistics Cluster
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
          • v2.4 Active
        </span>
      </div>

      {/* Quantum Fleet Engine Status Card */}
      <div style={{
        background: '#EFF6FF',
        border: '1px solid #DBEAFE',
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#1E3A8A' }}>
                Quantum Fleet Engine
              </span>
              <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '9px', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                SYNC
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#3B82F6' }}>
              • Real-time matrix solver synced • 12ms latency
            </div>
          </div>
        </div>

        <button 
          onClick={() => alert('Matrix solver re-synced with Bhopal Live traffic nodes.')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB', padding: '4px' }}
        >
          <RotateCw size={16} />
        </button>
      </div>

      {/* Origin Depot Card */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#015C3B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }} />
            ORIGIN DEPOT
          </span>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
            Departure: 08:30 AM
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
              Board Office Central Hub
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Zone 1, Maharana Pratap Nagar, Bhopal
            </div>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={16} color="#015C3B" />
          </div>
        </div>
      </div>

      {/* Fleet Configuration */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>FLEET CONFIGURATION</span>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} /> Multi-Vehicle Mode
          </span>
        </div>

        {/* Fleet Size Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>Fleet Size</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Active commercial vans</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setFleetSize(Math.max(1, fleetSize - 1))}
              style={stepperBtnStyle}
            >
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', minWidth: '16px', textAlign: 'center' }}>
              {fleetSize}
            </span>
            <button 
              onClick={() => setFleetSize(fleetSize + 1)}
              style={stepperBtnStyle}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Payload Max */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #E2E8F0'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>1,000 kg Payload</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Max capacity / vehicle</div>
          </div>
          <SlidersHorizontal size={16} color="#64748B" />
        </div>
      </div>

      {/* Delivery Steps List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Delivery Stops</span>
            <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '10px', fontWeight: '800', padding: '1px 6px', borderRadius: '4px' }}>
              10 Loaded
            </span>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#059669', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PlusCircle size={14} /> Add Manually
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Stop 1 */}
          <div style={stopItemStyle}>
            <div style={{ ...stopBadgeStyle, background: '#2563EB' }}>1</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>New Market Commercial Hub</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>180 kg • 09:00 - 10:30 AM</div>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* Stop 2 */}
          <div style={stopItemStyle}>
            <div style={{ ...stopBadgeStyle, background: '#2563EB' }}>2</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>MP Nagar Zone-2</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>240 kg • 10:45 - 11:30 AM</div>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* Stop 3 */}
          <div style={stopItemStyle}>
            <div style={{ ...stopBadgeStyle, background: '#2563EB' }}>3</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Kolar Road Retailers</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>150 kg • 11:45 AM - 01:00 PM</div>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* Stop 4 (Priority Medical) */}
          <div style={{ ...stopItemStyle, border: '1px solid #FECACA' }}>
            <div style={{ ...stopBadgeStyle, background: '#DC2626' }}>4</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>AIIMS Bhopal Logistics Gate</span>
                <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '9px', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' }}>
                  Priority Medical
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '600' }}>310 kg • Strict 01:15 PM SLA</div>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* Stop 5 */}
          <div style={stopItemStyle}>
            <div style={{ ...stopBadgeStyle, background: '#2563EB' }}>5</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Bairagarh Wholesale Market</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>120 kg • Afternoon Delivery</div>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          <button style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '12px',
            padding: '10px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#475569',
            cursor: 'pointer'
          }}>
            ••• + 5 more stops (Gulmohar, TT Nagar...) View all
          </button>
        </div>
      </div>

      {/* Quantum Route Optimization Projected Efficiency Card */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
              Quantum Route Optimization
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Expected efficiency across Bhopal cluster
            </div>
          </div>
          <span style={{ background: result ? '#DCFCE7' : '#EFF6FF', color: result ? '#166534' : '#2563EB', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '999px' }}>
            {result ? '✓ Live Result' : '• Projected'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          textAlign: 'center'
        }}>
          <div style={{ background: '#F8FAFC', padding: '10px 4px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#059669' }}>
              {result ? `-${Math.round((result.co2_saved_kg || 38.4) / 1.2)}%` : '-28%'}
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>Fuel / Energy</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '10px 4px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#059669' }}>
              {result ? `-${result.total_distance_km || 42} km` : '-42 km'}
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>Total Route</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '10px 4px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#059669' }}>
              {result ? `${Math.floor((result.total_time_min || 75) / 60)}h ${(result.total_time_min || 75) % 60}m` : '1h 15m'}
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>Fleet Saved</div>
          </div>
        </div>
      </div>

      {/* Optimize Routes CTA */}
      <div>
        <button 
          onClick={async () => {
            if (loading || optimized) return;
            setLoading(true);
            try {
              const res = await QRouteAPI.submitOptimization({
                num_vehicles: fleetSize,
                vehicle_capacity: 100.0,
                customer_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              });
              const resultData = res.data || {};
              setResult({
                total_distance_km: resultData.total_distance_km || 32,
                total_time_min: resultData.total_time_min || 78,
                co2_saved_kg: resultData.co2_saved_kg || 38.4
              });
              setOptimized(true);
              showToast && showToast(`✅ ${fleetSize} vehicle routes optimized! ${resultData.co2_saved_kg || 38.4} kg CO₂ saved`, 'success', 4000);
            } catch (err) {
              showToast && showToast('Could not reach optimization engine. Using projected values.', 'error');
            } finally {
              setLoading(false);
            }
          }}
          className="btn-primary"
          style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (loading || optimized) ? 0.8 : 1 }}
        >
          {loading ? (
            <><span className="qr-spinner" />&nbsp;Running D-QPSO Solver...</>
          ) : (
            <><Sparkles size={18} />{optimized ? 'Routes Optimized ✓ Active' : 'Optimize Routes'}</>
          )}
        </button>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#059669', fontWeight: '600', marginTop: '6px' }}>
          🌱 Reduces approx {result ? `${result.co2_saved_kg} kg` : '38.4 kg'} CO₂ equivalent today
        </div>
      </div>
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

const stepperBtnStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: '1px solid #CBD5E1',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const stopItemStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
};

const stopBadgeStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: '800'
};
