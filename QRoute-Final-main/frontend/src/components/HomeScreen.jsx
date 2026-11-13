import React from 'react';
import { 
  Search, 
  Mic, 
  Car, 
  Truck, 
  Bus, 
  Zap, 
  AlertOctagon, 
  GitBranch, 
  Sun, 
  Leaf, 
  AlertTriangle, 
  Wifi, 
  CreditCard, 
  ArrowRight,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function HomeScreen({ onNavigate, onOpenEmergency }) {
  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Search Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '9999px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E2E8F0',
        cursor: 'pointer'
      }} onClick={() => onNavigate('plan')}>
        <Search size={20} color="#00B368" />
        <span style={{ color: '#64748B', fontSize: '15px', fontWeight: '500', flex: 1 }}>
          Where do you want to go?
        </span>
        <Mic size={18} color="#94A3B8" />
      </div>

      {/* Quick Actions Grid (2x3) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginTop: '4px'
      }}>
        <div 
          onClick={() => onNavigate('plan')} 
          style={actionCardStyle}
        >
          <div style={{ ...iconCircleStyle, background: '#EFF6FF', color: '#2563EB' }}>
            <Car size={22} />
          </div>
          <span style={actionTextStyle}>Plan Trip</span>
        </div>

        <div 
          onClick={() => onNavigate('fleet')} 
          style={actionCardStyle}
        >
          <div style={{ ...iconCircleStyle, background: '#FFF7ED', color: '#EA580C' }}>
            <Truck size={22} />
          </div>
          <span style={actionTextStyle}>Delivery</span>
        </div>

        <div 
          onClick={() => onNavigate('public-transport')} 
          style={actionCardStyle}
        >
          <div style={{ ...iconCircleStyle, background: '#F0FDF4', color: '#059669' }}>
            <Bus size={22} />
          </div>
          <span style={actionTextStyle}>Bus / Metro</span>
        </div>

        <div 
          onClick={() => onNavigate('ev-planner')} 
          style={actionCardStyle}
        >
          <div style={{ ...iconCircleStyle, background: '#ECFDF5', color: '#10B981' }}>
            <Zap size={22} />
          </div>
          <span style={actionTextStyle}>EV Route</span>
        </div>

        <div 
          onClick={() => onNavigate('emergency-response')} 
          style={actionCardStyle}
        >
          <div style={{ ...iconCircleStyle, background: '#FEF2F2', color: '#EF4444' }}>
            <AlertOctagon size={22} />
          </div>
          <span style={actionTextStyle}>Emergency</span>
        </div>

        <div 
          onClick={() => onNavigate('alerts')} 
          style={actionCardStyle}
        >
          <div style={{ ...iconCircleStyle, background: '#F0F9FF', color: '#0284C7' }}>
            <GitBranch size={22} />
          </div>
          <span style={actionTextStyle}>Live Traffic</span>
        </div>
      </div>

      {/* Live Traffic & Environment Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }}></span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
              Live Traffic & Environment
            </span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '0.4px' }}>
            UPPER LAKE BASIN
          </span>
        </div>

        {/* Weather & Eco Card */}
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sun size={24} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
                  28°C <span style={{ fontWeight: '500', fontSize: '14px', color: '#64748B' }}>• Clear Sky</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Upper Lake Area, Bhopal</div>
              </div>
            </div>
            <span className="badge badge-green" style={{ fontSize: '10px' }}>
              🌱 ECO-FRIENDLY
            </span>
          </div>

          {/* Eco Impact Subcard */}
          <div style={{
            background: '#F0FDF4',
            borderRadius: '14px',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            border: '1px solid #DCFCE7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#015C3B',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Leaf size={16} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: '600', textTransform: 'uppercase' }}>
                  ECO IMPACT TODAY
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#015C3B' }}>
                  1.8 kg CO₂ saved
                </div>
              </div>
            </div>
            <span style={{
              background: 'white',
              color: '#166534',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '700',
              border: '1px solid #BBF7D0'
            }}>
              +14% vs avg
            </span>
          </div>

          {/* Heavy Delay Alert Snippet */}
          <div 
            onClick={() => onNavigate('alerts')}
            style={{
              background: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: '14px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#DC2626',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <AlertTriangle size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#991B1B' }}>
                  Metro Line-1 • Roshanpura Sq.
                </span>
                <span style={{
                  background: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}>
                  HEAVY DELAY
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#7F1D1D', lineHeight: '1.4' }}>
                Approaching Roshanpura Square. Construction lane restrictions causing dense bottleneck...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Passing Buses */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bus size={18} color="#00B368" />
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
              Next Passing Buses
            </span>
          </div>
          <button 
            onClick={() => onNavigate('public-transport')}
            style={{ background: 'none', border: 'none', color: '#00B368', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            All Stops &gt;
          </button>
        </div>

        {/* Bus Card 1 - TR-1 */}
        <div 
          onClick={() => onNavigate('public-transport')} 
          className="card" 
          style={{ padding: '14px 16px', marginBottom: '10px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{
                background: '#015C3B',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '800'
              }}>
                TR-1
              </span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
                  Misrod &rarr; Bairagarh
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Via MP Nagar • Hamidia Hospital
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#015C3B' }}>
                3 min
              </div>
              <div style={{ fontSize: '11px', color: '#166534', fontWeight: '600' }}>
                On Schedule
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span style={busPillStyle}>
              💺 42 seats free
            </span>
            <span style={{ ...busPillStyle, background: '#EFF6FF', color: '#2563EB' }}>
              ⚡ AC Electric
            </span>
            <span style={{ ...busPillStyle, background: '#F1F5F9', color: '#475569' }}>
              <Wifi size={11} /> Free Wi-Fi
            </span>
          </div>
        </div>

        {/* Bus Card 2 - SR-4 */}
        <div 
          onClick={() => onNavigate('public-transport')} 
          className="card" 
          style={{ padding: '14px 16px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{
                background: '#475569',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '800'
              }}>
                SR-4
              </span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
                  ISBT &rarr; Karond Mandi
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Via Nadra Bus Stand • DIG Bunglow
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                11 min
              </div>
              <div style={{ fontSize: '11px', color: '#D97706', fontWeight: '600' }}>
                Crowded
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <span style={{ ...busPillStyle, background: '#FEF3C7', color: '#B45309' }}>
              👥 Moderate crowd
            </span>
            <span style={{ ...busPillStyle, background: '#F1F5F9', color: '#475569' }}>
              ♿ Wheelchair Access
            </span>
          </div>
        </div>
      </div>

      {/* Q-Route Digital Smart Card (Bhopal Transit Pass) */}
      <div style={{
        background: 'linear-gradient(135deg, #015C3B 0%, #064E3B 100%)',
        borderRadius: '20px',
        padding: '18px',
        color: 'white',
        boxShadow: '0 8px 24px rgba(1, 92, 59, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background circle */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.4px'
          }}>
            BHOPAL TRANSIT PASS
          </span>
          <CreditCard size={20} color="#6EE7B7" />
        </div>

        <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>
          Q-Route Digital Smart Card
        </div>
        <div style={{ fontSize: '12px', color: '#A7F3D0', marginBottom: '14px' }}>
          Tap & Ride on all BCLL BRTS buses
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Balance: ₹240.50</span>
          </div>

          <button 
            onClick={() => alert('Quick Recharge: ₹100 added to Q-Route Card!')}
            style={{
              background: 'white',
              color: '#015C3B',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Recharge
          </button>
        </div>
      </div>
    </div>
  );
}

const actionCardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '12px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
  border: '1px solid #E2E8F0',
  transition: 'transform 0.15s ease'
};

const iconCircleStyle = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const actionTextStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#1E293B',
  textAlign: 'center'
};

const busPillStyle = {
  background: '#E8F8F0',
  color: '#015C3B',
  padding: '4px 10px',
  borderRadius: '9999px',
  fontSize: '11px',
  fontWeight: '700',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px'
};
