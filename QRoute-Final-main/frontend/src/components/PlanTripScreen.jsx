import React, { useState } from 'react';
import { QRouteAPI } from '../services/api';
import { 
  ArrowLeft, 
  History, 
  MapPin, 
  ArrowUpDown, 
  Car, 
  Bike, 
  Zap, 
  Bus, 
  Footprints, 
  Sparkles, 
  Leaf, 
  ShieldAlert, 
  Clock, 
  Calendar,
  Radio
} from 'lucide-react';

export default function PlanTripScreen({ onBack, onStartNavigation, onShowResults }) {
  const [origin, setOrigin] = useState('Board Office, Bhopal');
  const [destination, setDestination] = useState('Rani Kamlapati Railway Station');
  const [travelMode, setTravelMode] = useState('car');
  const [preference, setPreference] = useState('fastest');
  const [departureTime, setDepartureTime] = useState('now');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <button 
          onClick={onBack}
          style={iconHeaderBtnStyle}
        >
          <ArrowLeft size={18} color="#0F172A" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
            Plan Your Trip
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', color: '#059669', fontWeight: '700' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }} />
            Smart Multimodal Transit
          </div>
        </div>

        <button 
          onClick={() => alert('Recent Trips: Board Office -> Rani Kamlapati, MP Nagar -> Airport')}
          style={iconHeaderBtnStyle}
        >
          <History size={18} color="#0F172A" />
        </button>
      </div>

      {/* From / To Route Input Card */}
      <div className="card" style={{ padding: '16px', position: 'relative' }}>
        {/* Origin */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '3px solid #00B368',
              background: 'white'
            }} />
            <div style={{ width: '2px', height: '36px', borderLeft: '2px dashed #CBD5E1', margin: '3px 0' }} />
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '3px solid #DC2626',
              background: 'white'
            }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* From Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', letterSpacing: '0.4px' }}>FROM</span>
                <span style={{ background: '#E8F8F0', color: '#015C3B', fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px' }}>
                  🎯 Current
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{origin}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>MP Nagar Zone 1</div>
            </div>

            {/* To Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', letterSpacing: '0.4px' }}>TO</span>
                <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px' }}>
                  Hub Terminal
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{destination}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Habibganj, Bhopal</div>
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
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowUpDown size={16} color="#0F172A" />
          </button>
        </div>
      </div>

      {/* Travel Mode Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#475569', letterSpacing: '0.4px' }}>
            TRAVEL MODE
          </span>
          <span style={{
            background: '#DCFCE7',
            color: '#166534',
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Leaf size={11} /> Low emission options
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          <button 
            onClick={() => setTravelMode('car')}
            style={{ ...modeBtnStyle, background: travelMode === 'car' ? '#0062FF' : 'white', color: travelMode === 'car' ? 'white' : '#475569' }}
          >
            <Car size={18} />
            <span style={{ fontSize: '11px', fontWeight: '700' }}>Car</span>
          </button>

          <button 
            onClick={() => setTravelMode('bike')}
            style={{ ...modeBtnStyle, background: travelMode === 'bike' ? '#0062FF' : 'white', color: travelMode === 'bike' ? 'white' : '#475569' }}
          >
            <Bike size={18} />
            <span style={{ fontSize: '11px', fontWeight: '700' }}>Bike</span>
          </button>

          <button 
            onClick={() => setTravelMode('ev')}
            style={{ ...modeBtnStyle, background: travelMode === 'ev' ? '#0062FF' : 'white', color: travelMode === 'ev' ? 'white' : '#475569' }}
          >
            <div style={{ position: 'relative' }}>
              <Zap size={18} />
              <span style={{ position: 'absolute', top: '-2px', right: '-4px', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700' }}>EV</span>
          </button>

          <button 
            onClick={() => setTravelMode('bus')}
            style={{ ...modeBtnStyle, background: travelMode === 'bus' ? '#0062FF' : 'white', color: travelMode === 'bus' ? 'white' : '#475569' }}
          >
            <Bus size={18} />
            <span style={{ fontSize: '11px', fontWeight: '700' }}>Bus</span>
          </button>

          <button 
            onClick={() => setTravelMode('walk')}
            style={{ ...modeBtnStyle, background: travelMode === 'walk' ? '#0062FF' : 'white', color: travelMode === 'walk' ? 'white' : '#475569' }}
          >
            <Footprints size={18} />
            <span style={{ fontSize: '11px', fontWeight: '700' }}>Walk</span>
          </button>
        </div>
      </div>

      {/* Route Preferences */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', letterSpacing: '0.4px', marginBottom: '8px' }}>
          ROUTE PREFERENCES
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button 
            onClick={() => setPreference('fastest')}
            style={{
              ...prefPillStyle,
              background: preference === 'fastest' ? '#1E293B' : 'white',
              color: preference === 'fastest' ? 'white' : '#334155'
            }}
          >
            <Sparkles size={14} color={preference === 'fastest' ? '#FCD34D' : '#F59E0B'} />
            Fastest
          </button>

          <button 
            onClick={() => setPreference('eco')}
            style={{
              ...prefPillStyle,
              background: preference === 'eco' ? '#015C3B' : 'white',
              color: preference === 'eco' ? 'white' : '#334155'
            }}
          >
            <Leaf size={14} color={preference === 'eco' ? '#86EFAC' : '#059669'} />
            Eco-Friendly
          </button>

          <button 
            onClick={() => setPreference('avoid-traffic')}
            style={{
              ...prefPillStyle,
              background: preference === 'avoid-traffic' ? '#1E293B' : 'white',
              color: preference === 'avoid-traffic' ? 'white' : '#334155'
            }}
          >
            <ShieldAlert size={14} color={preference === 'avoid-traffic' ? '#F87171' : '#DC2626'} />
            Avoid Traffic
          </button>
        </div>
      </div>

      {/* Departure Selector */}
      <div className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>DEPARTURE</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>Leave Now</div>
          </div>
        </div>

        <button 
          onClick={() => alert('Schedule trip departure time selector')}
          style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#1E293B',
            cursor: 'pointer'
          }}
        >
          <Calendar size={14} color="#059669" />
          Select Time
        </button>
      </div>

      {/* Route Preview Card */}
      <div className="card" style={{ padding: '14px', border: '1px solid #CBD5E1' }}>
        {/* Map Preview Graphic */}
        <div style={{
          height: '110px',
          background: 'linear-gradient(180deg, #E2EEEC 0%, #D5E5E2 100%)',
          borderRadius: '14px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px'
        }}>
          {/* Subtle map lines */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <path d="M 20 20 Q 150 90, 400 30" stroke="#00B368" strokeWidth="4" fill="none" strokeDasharray="4 2" />
            <circle cx="50" cy="30" r="5" fill="#015C3B" />
            <circle cx="360" cy="40" r="6" fill="#DC2626" />
          </svg>

          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            gap: '6px'
          }}>
            <span style={{
              background: '#015C3B',
              color: 'white',
              fontSize: '10px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              OPTIMAL LINK: Link Rd No. 1
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#334155',
              fontSize: '10px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              Via Chetak Bridge
            </span>
          </div>
        </div>

        {/* ETA & Efficiency */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>~31 min</span>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginLeft: '8px' }}>14.2 km</span>
          </div>
          <span style={{
            background: '#DCFCE7',
            color: '#166534',
            fontSize: '11px',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            🌱 18% less CO₂
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
          via Link Road No. 1 & Chetak Bridge
        </div>

        {/* GTFS Live Transit Notification */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '10px 12px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#015C3B',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Bus size={15} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              GTFS LIVE TRANSIT <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#334155' }}>
              High frequency city bus <strong>TR-1</strong> passes every 8 mins along this corridor.
            </div>
          </div>
        </div>
      </div>

      {/* Find Best Route CTA */}
      <button 
        onClick={async () => {
          await QRouteAPI.planRoute({
            origin_name: origin,
            destination_name: destination,
            mode: travelMode,
            preference: preference
          });
          if (onShowResults) onShowResults();
          else if (onStartNavigation) onStartNavigation();
        }}
        className="btn-primary-green"
        style={{ width: '100%', padding: '16px' }}
      >
        Find Best Route &rarr;
      </button>

      {/* Footer engine credit */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '11px',
        color: '#64748B',
        marginTop: '4px'
      }}>
        <Radio size={13} color="#059669" />
        Bhopal City Smart Commute Engine • Live GTFS-RT feed
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

const modeBtnStyle = {
  border: '1px solid #E2E8F0',
  borderRadius: '14px',
  padding: '12px 4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  transition: 'all 0.15s ease'
};

const prefPillStyle = {
  padding: '8px 14px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '700',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  border: '1px solid #E2E8F0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
};
