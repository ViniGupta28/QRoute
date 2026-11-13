import React, { useState, useEffect } from 'react';
import { QRouteAPI } from '../services/api';
import { 
  AlertTriangle, 
  GitBranch, 
  Bus, 
  Wind, 
  Sun, 
  Clock, 
  Info, 
  Wrench, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Car, 
  Droplet, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AlertsScreen({ onNavigate, showToast }) {
  const [filter, setFilter] = useState('all');
  const [detourApplied, setDetourApplied] = useState(false);
  const [reportedType, setReportedType] = useState(null);
  const [trafficData, setTrafficData] = useState([]);
  const [isSyncing, setIsSyncing] = useState(true);

  // Fetch live traffic on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchTraffic() {
      setIsSyncing(true);
      try {
        const data = await QRouteAPI.getCurrentTraffic();
        if (!cancelled) setTrafficData(Array.isArray(data) ? data : []);
      } catch (_) {
        // fallback silently - api.js already returns fallback data
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    }
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 30000); // refresh every 30s
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const handleReport = async (type) => {
    setReportedType(type);
    try {
      await QRouteAPI.reportIncident({
        incident_type: type.toUpperCase(),
        severity: 'HIGH',
        description: `Citizen reported ${type} event via Q-Route mobile app`,
        edge_id: 'BHOPAL_CENTRAL_ROAD'
      });
      showToast && showToast(`✅ ${type} report synced with Bhopal Smart Traffic Control Room`, 'success', 4000);
    } catch (_) {
      showToast && showToast(`Report saved locally. Will sync when connected.`, 'info');
    } finally {
      setTimeout(() => setReportedType(null), 1200);
    }
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '4px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
            Live Alerts & Traffic
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            Real-time transit diagnostics & urban conditions
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#F1F5F9',
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid #E2E8F0'
        }}>
          {isSyncing
            ? <span className="qr-spinner" style={{ width: '10px', height: '10px', borderColor: 'rgba(0,0,0,0.15)', borderTopColor: '#015C3B' }} />
            : <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
          }
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', letterSpacing: '0.4px' }}>
            {isSyncing ? 'SYNCING...' : 'LIVE'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            ...pillTabStyle,
            background: filter === 'all' ? '#015C3B' : 'white',
            color: filter === 'all' ? 'white' : '#1E293B'
          }}
        >
          All <span style={{
            background: filter === 'all' ? '#00B368' : '#F1F5F9',
            color: filter === 'all' ? 'white' : '#475569',
            padding: '1px 6px',
            borderRadius: '999px',
            fontSize: '10px'
          }}>5</span>
        </button>

        <button
          onClick={() => setFilter('transit')}
          style={{
            ...pillTabStyle,
            background: filter === 'transit' ? '#015C3B' : 'white',
            color: filter === 'transit' ? 'white' : '#1E293B'
          }}
        >
          <Bus size={14} color={filter === 'transit' ? '#34D399' : '#059669'} />
          Transit & Metro
        </button>

        <button
          onClick={() => setFilter('road')}
          style={{
            ...pillTabStyle,
            background: filter === 'road' ? '#015C3B' : 'white',
            color: filter === 'road' ? 'white' : '#1E293B'
          }}
        >
          <AlertCircle size={14} color={filter === 'road' ? '#FCA5A5' : '#DC2626'} />
          Road Incidents
        </button>
      </div>

      {/* Alert Feed Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Live Road Speeds from Backend */}
        {trafficData.length > 0 && (filter === 'all' || filter === 'road') && (
          <div className="card" style={{ padding: '14px 16px', borderTop: '4px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#015C3B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Car size={14} /> LIVE ROAD SPEEDS
              </span>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Backend Live</span>
            </div>
            {trafficData.slice(0, 4).map((road, i) => {
              const congColor = road.congestion_level === 'FREE_FLOW' ? '#059669'
                : road.congestion_level === 'LOW' ? '#16A34A'
                : road.congestion_level === 'MODERATE' ? '#D97706'
                : '#DC2626';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < trafficData.slice(0, 4).length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>{road.edge_id?.replace(/_/g, ' ')}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: congColor }}>{Math.round(road.speed_kmh)} km/h</span>
                    <span style={{ fontSize: '10px', background: congColor + '20', color: congColor, padding: '2px 7px', borderRadius: '999px', fontWeight: '700' }}>
                      {road.congestion_level?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Card 1: Critical Metro Gridlock */}
        {(filter === 'all' || filter === 'road' || filter === 'transit') && (
          <div className="card" style={{
            borderTop: '4px solid #DC2626',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: '#FEE2E2',
                  color: '#DC2626',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '800'
                }}>
                  CRITICAL
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Updated 2m ago
                </span>
              </div>

              <span style={{
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '800'
              }}>
                +18 min delay
              </span>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
              Metro Line-1 Pillar Work & Gridlock
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', marginBottom: '12px' }}>
              Heavy slow-moving corridor approaching Roshanpura Square through MP Nagar Zone-1 due to girder transit cranes.
            </p>

            {/* Smart Detour Subcard */}
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #DCFCE7',
              borderRadius: '12px',
              padding: '10px 12px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GitBranch size={15} color="#059669" />
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#015C3B' }}>
                    Smart Detour Suggested
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669' }}>
                  Saves 12 min
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#166534', lineHeight: '1.4' }}>
                Reroute via Link Road No. 1 into Mata Mandir bypass to avoid the central bottleneck.
              </p>
            </div>

            <button 
              onClick={() => setDetourApplied(!detourApplied)}
              style={{
                width: '100%',
                background: detourApplied ? '#059669' : '#015C3B',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              {detourApplied ? <CheckCircle size={16} /> : <GitBranch size={16} />}
              {detourApplied ? 'Detour Active & Synced' : 'Apply Detour'}
            </button>
          </div>
        )}

        {/* Card 2: Bus Service Diversion (Route TR-1) */}
        {(filter === 'all' || filter === 'transit') && (
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                  BUS SERVICE
                </span>
                <span style={{ background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                  Route TR-1
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Updated 14m ago
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#DBEAFE',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bus size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                  Route TR-1 Service Diversion
                </h3>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
                  Rerouted away from Arera Colony internal road due to urgent smart water pipeline maintenance by BMC.
                </p>
              </div>
            </div>

            {/* Temporary Stoppages */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              padding: '8px 12px',
              marginBottom: '10px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
                TEMPORARY STOPPAGES
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#94A3B8' }}>
                  10 No. Market Stop
                </span>
                <span style={{ color: '#00B368', fontWeight: '800' }}>&rarr;</span>
                <span style={{
                  background: '#DCFCE7',
                  color: '#166534',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  Camp 7 Bypass Stop
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: '600' }}>
                <Clock size={13} />
                Next bus arriving in 8 min
              </div>
              <button 
                onClick={() => onNavigate('map')}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#1E293B',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                View Map Path
              </button>
            </div>
          </div>
        )}

        {/* Card 3: Environment & Air Quality */}
        {filter === 'all' && (
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ background: '#EDE9FE', color: '#7C3AED', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                ENVIRONMENT
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                Upper Lake Station • Live Readings
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              {/* AQI */}
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>AIR QUALITY</span>
                  <Wind size={14} color="#059669" />
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
                  112 <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>AQI</span>
                </div>
                <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>
                  Moderate
                </span>
              </div>

              {/* Weather */}
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>WEATHER</span>
                  <Sun size={14} color="#F59E0B" />
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
                  28°C
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                  Sunny & Breeze
                </span>
              </div>
            </div>

            {/* Green Commute Incentive */}
            <div style={{
              background: '#F0FDF4',
              borderRadius: '12px',
              padding: '10px 12px',
              border: '1px solid #DCFCE7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <ShieldCheck size={16} color="#059669" />
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#015C3B' }}>
                  Green Commute Incentive Active
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#166534', lineHeight: '1.4' }}>
                Opt for Bhopal Metro or Q-Cycle e-bikes today to earn 2x Green Credits toward bus pass renews.
              </p>
            </div>
          </div>
        )}

        {/* Card 4: Board Office Square Bottleneck */}
        {(filter === 'all' || filter === 'road') && (
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                  CONGESTION
                </span>
                <span style={{ background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                  Zone-1 Central
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Updated 6m ago
              </span>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Board Office Square Bottleneck
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', marginBottom: '10px' }}>
              Traffic signal cycle dynamically prolonged by 45 seconds towards Chetak Bridge to clear junction accumulation.
            </p>

            <div style={{
              background: '#F8FAFC',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#334155'
            }}>
              <Info size={14} color="#2563EB" />
              Traffic police marshals deployed on site managing left turn.
            </div>
          </div>
        )}

        {/* Card 5: Scheduled VIP Road Operations */}
        {filter === 'all' && (
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                  SCHEDULED
                </span>
                <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                  Night Operations
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                Tonight
              </span>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              VIP Road Smart Lighting Replacement
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              Single lane closure between Khanoo Gaon and Retghat from 10:00 PM to 05:00 AM. Plan early night travel.
            </p>
          </div>
        )}

        {/* Card 6: Citizen Assist Incident Reporting Box */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div>
              <span style={{
                background: '#DCFCE7',
                color: '#166534',
                fontSize: '10px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                CITIZEN ASSIST
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
                Encountered an issue?
              </h3>
            </div>

            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#015C3B',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={18} />
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', marginBottom: '14px' }}>
            Report waterlogging, road damage, or sudden transit hold-ups to inform fellow Bhopal travelers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button 
              onClick={() => handleReport('Traffic Jam')}
              style={reportBtnStyle}
            >
              <Car size={18} color="#DC2626" />
              <span>Traffic Jam</span>
            </button>

            <button 
              onClick={() => handleReport('Waterlog')}
              style={reportBtnStyle}
            >
              <Droplet size={18} color="#0284C7" />
              <span>Waterlog</span>
            </button>

            <button 
              onClick={() => handleReport('Breakdown')}
              style={reportBtnStyle}
            >
              <AlertTriangle size={18} color="#D97706" />
              <span>Breakdown</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const pillTabStyle = {
  padding: '6px 14px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '700',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  border: '1px solid #E2E8F0'
};

const reportBtnStyle = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '10px 6px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: '700',
  color: '#334155',
  transition: 'background 0.15s ease'
};
