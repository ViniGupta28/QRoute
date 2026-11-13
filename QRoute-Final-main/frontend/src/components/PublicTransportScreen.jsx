import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowUpDown, 
  Bus, 
  Footprints, 
  Navigation, 
  Radio, 
  Clock, 
  Train, 
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

export default function PublicTransportScreen({ onBack, onNavigateToMap, onSelectRoute }) {
  const [origin, setOrigin] = useState('Board Office, Bhopal');
  const [destination, setDestination] = useState('Chirayu Hospital & Medical College');
  const [selectedFilter, setSelectedFilter] = useState('best');
  const [selectedItinerary, setSelectedItinerary] = useState(0);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const itineraries = [
    {
      id: 0,
      tag: 'RECOMMENDED',
      tagColor: '#DCFCE7',
      tagTextColor: '#166534',
      badge2: 'AC Electric',
      fare: '₹15',
      fareType: 'Direct Trip',
      duration: '42',
      eta: 'Arr ~ 09:22 AM',
      steps: [
        { type: 'walk', label: '5m' },
        { type: 'bus', label: 'TR-1 Express (14 stops)', isMain: true, bg: '#015C3B', color: 'white' },
        { type: 'walk', label: '7m' }
      ],
      status: 'Departing in 4 min from MP Nagar Stop 2',
      crowd: 'Low crowd (24 seats free)',
      statusColor: '#059669'
    },
    {
      id: 1,
      tag: 'BCLL RAPID',
      tagColor: '#EFF6FF',
      tagTextColor: '#1E40AF',
      fare: '₹15',
      fareType: 'Direct Trip',
      duration: '48',
      eta: 'Arr ~ 09:36 AM',
      steps: [
        { type: 'walk', label: '7m' },
        { type: 'bus', label: 'B-36 Rapid (18 stops)', isMain: true, bg: '#059669', color: 'white' },
        { type: 'walk', label: '7m' }
      ],
      status: 'Departing in 12 min',
      crowd: 'Moderate crowd',
      statusColor: '#64748B'
    },
    {
      id: 2,
      tag: 'FASTEST MULTIMODAL',
      tagColor: '#DBEAFE',
      tagTextColor: '#1E40AF',
      badge2: 'Zero Emissions',
      fare: '₹20',
      fareType: 'Combined Fare',
      duration: '35',
      eta: 'Arr ~ 09:18 AM',
      steps: [
        { type: 'walk', label: 'Subhash Ngr' },
        { type: 'metro', label: 'Line 1 (6 st)', isMain: true, bg: '#2563EB', color: 'white' },
        { type: 'feeder', label: 'e-Feeder', bg: '#DCFCE7', color: '#166534' }
      ],
      status: 'Metro departs in 6 min',
      crowd: 'High frequency',
      statusColor: '#2563EB'
    },
    {
      id: 3,
      tag: 'STANDARD BUS',
      tagColor: '#F1F5F9',
      tagTextColor: '#475569',
      fare: '₹15',
      fareType: '1 Transfer',
      duration: '55',
      eta: 'Arr ~ 09:48 AM',
      steps: [
        { type: 'walk', label: '4m walk' },
        { type: 'bus', label: 'B-37', bg: '#F8FAFC', color: '#334155' },
        { type: 'node', label: 'Roshanpura' },
        { type: 'bus', label: 'TR-4', bg: '#F8FAFC', color: '#334155' }
      ],
      status: 'Departing in 8 min',
      crowd: 'Standard BCLL Route',
      statusColor: '#64748B'
    }
  ];

  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Sub-Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <button 
          onClick={onBack}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Back to Dashboard"
        >
          <ArrowLeft size={18} color="#0F172A" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
              Public Transport
            </h2>
            <span style={{
              background: '#DCFCE7',
              color: '#166534',
              fontSize: '10px',
              fontWeight: '800',
              padding: '1px 6px',
              borderRadius: '999px'
            }}>
              LIVE
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
            Bhopal Metro &amp; BCLL City Bus Network
          </div>
        </div>

        <div style={{
          background: '#EFF6FF',
          color: '#1D4ED8',
          fontSize: '11px',
          fontWeight: '800',
          padding: '4px 10px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }}></span>
          <span>GTFS</span>
        </div>
      </div>

      {/* From / To Route Box */}
      <div className="card" style={{ padding: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Timeline Connector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '3px solid #00B368', background: 'white' }} />
            <div style={{ width: '2px', height: '36px', borderLeft: '2px dashed #CBD5E1', margin: '3px 0' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '3px solid #EF4444', background: 'white' }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', letterSpacing: '0.4px', marginBottom: '2px' }}>
                FROM ORIGIN
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>{origin}</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', letterSpacing: '0.4px', marginBottom: '2px' }}>
                TO DESTINATION
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>{destination}</div>
            </div>
          </div>

          {/* Swap Button */}
          <button 
            onClick={handleSwap}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A'
            }}
          >
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { id: 'best', label: 'Best Route', icon: Sparkles },
          { id: 'walk', label: 'Least Walk', icon: Footprints },
          { id: 'transfer', label: 'Fewer Transfers', icon: Bus }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                background: active ? '#015C3B' : 'white',
                color: active ? 'white' : '#475569',
                boxShadow: active ? '0 4px 12px rgba(1, 92, 59, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Available Itineraries Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }} />
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>Available Itineraries</span>
          </div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
            4 routes active
          </span>
        </div>

        {/* 4 Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {itineraries.map((item) => {
            const isSelected = selectedItinerary === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItinerary(item.id)}
                className="card"
                style={{
                  padding: '16px',
                  border: isSelected ? '2px solid #00B368' : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 6px 18px rgba(0, 179, 104, 0.12)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header row: Badges + Fare */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      background: item.tagColor,
                      color: item.tagTextColor,
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {item.tag}
                    </span>
                    {item.badge2 && (
                      <span style={{
                        background: '#EFF6FF',
                        color: '#2563EB',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {item.badge2}
                      </span>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#059669' }}>{item.fare}</span>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>{item.fareType}</div>
                  </div>
                </div>

                {/* Duration & ETA */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A' }}>{item.duration}</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>min</span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>• {item.eta}</span>
                </div>

                {/* Multimodal Steps Timeline */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F8FAFC',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  fontSize: '11px',
                  color: '#475569',
                  fontWeight: '600',
                  overflowX: 'auto',
                  scrollbarWidth: 'none'
                }}>
                  {item.steps.map((st, sidx) => (
                    <React.Fragment key={sidx}>
                      {sidx > 0 && <span style={{ color: '#CBD5E1' }}>&gt;</span>}
                      {st.type === 'walk' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                          <Footprints size={12} color="#64748B" />
                          <span>{st.label}</span>
                        </div>
                      )}
                      {st.type === 'bus' && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: st.bg,
                          color: st.color,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}>
                          <Bus size={12} />
                          <span>{st.label}</span>
                        </div>
                      )}
                      {st.type === 'metro' && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: st.bg,
                          color: st.color,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}>
                          <Train size={12} />
                          <span>{st.label}</span>
                        </div>
                      )}
                      {st.type === 'feeder' && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: st.bg,
                          color: st.color,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}>
                          <Zap size={12} />
                          <span>{st.label}</span>
                        </div>
                      )}
                      {st.type === 'node' && (
                        <span style={{ color: '#64748B', fontWeight: '700' }}>{st.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Subtext info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: item.statusColor, fontWeight: '700' }}>
                    <Clock size={12} />
                    <span>{item.status}</span>
                  </div>
                  <span style={{ color: '#64748B', fontWeight: '500' }}>
                    {item.crowd}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View on Live Map CTA */}
      <button 
        onClick={onNavigateToMap}
        className="btn-primary-green"
        style={{
          width: '100%',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 8px 20px rgba(0, 179, 104, 0.3)'
        }}
      >
        <Navigation size={18} />
        <span>View on Live Map</span>
      </button>

      {/* Subtext feed info */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#DCFCE7',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Radio size={16} />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
            Bhopal Smart City GTFS-RT Feed
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            ● Active (Updated 12 seconds ago)
          </div>
        </div>
      </div>
    </div>
  );
}
