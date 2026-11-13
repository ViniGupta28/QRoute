import React from 'react';
import { ArrowRight, Zap, Leaf } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '100%',
      background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 50%, #F8FAFC 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 20px 24px',
      overflow: 'hidden'
    }}>
      {/* Background Soft Blobs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(111, 251, 190, 0.35) 0%, rgba(218, 226, 253, 0.2) 60%, transparent 80%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Row with Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#F1F5F9',
          padding: '5px 12px',
          borderRadius: '999px',
          fontSize: '10px',
          fontWeight: '800',
          letterSpacing: '0.4px',
          color: '#1E293B',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B368' }} />
          <span>BHOPAL SMART TRANSIT</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#DCFCE7',
          padding: '5px 10px',
          borderRadius: '999px',
          fontSize: '10px',
          fontWeight: '800',
          color: '#166534'
        }}>
          <Leaf size={11} color="#059669" />
          <span>EV Ready</span>
        </div>
      </div>

      {/* Center Branding Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        zIndex: 10,
        margin: 'auto 0'
      }}>
        {/* Large Glowing Logo Circle */}
        <div style={{
          position: 'relative',
          width: '170px',
          height: '170px',
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 20px 45px rgba(0, 108, 73, 0.18), 0 0 0 1px rgba(0, 108, 73, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          marginBottom: '26px'
        }}>
          {/* Subtle Outer Glow Ring */}
          <div style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            background: 'rgba(111, 251, 190, 0.3)',
            filter: 'blur(10px)',
            zIndex: -1
          }} />

          {/* Official Q-ROUTE Logo Image */}
          <img 
            src="/qroute-logo.png" 
            alt="Q-Route Logo" 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />

          {/* Electric Bolt Floating Badge */}
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00B368'
          }}>
            <Zap size={18} fill="#00B368" />
          </div>
        </div>

        {/* Title Row with LIVE Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h1 style={{
            fontSize: '34px',
            fontWeight: '900',
            color: '#0F172A',
            letterSpacing: '-0.8px',
            lineHeight: '1'
          }}>
            Q-Route
          </h1>
          <span style={{
            background: '#6FFBBE',
            color: '#005236',
            fontSize: '11px',
            fontWeight: '800',
            padding: '3px 8px',
            borderRadius: '999px',
            letterSpacing: '0.4px'
          }}>
            LIVE
          </span>
        </div>

        <h2 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#334155',
          marginBottom: '8px'
        }}>
          Smarter Routes. Greener Cities.
        </h2>

        <p style={{
          fontSize: '12px',
          color: '#64748B',
          maxWidth: '260px',
          lineHeight: '1.45',
          marginBottom: '22px'
        }}>
          AI-powered multi-modal public transit &amp; EV logistics network
        </p>

        {/* 3 Dots */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#006C49' }} />
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#7F9FFF' }} />
        </div>

        {/* Enter CTA */}
        <button
          onClick={onComplete}
          className="btn-primary-green"
          style={{
            minWidth: '220px',
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0, 108, 73, 0.28)'
          }}
        >
          <span>Enter App</span>
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Footer Branding */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        textAlign: 'center',
        zIndex: 10,
        paddingBottom: '8px'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#334155',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>Powered by</span>
          <span style={{ color: '#006C49', fontWeight: '800' }}>Quantum Seed</span>
          <span>🌱</span>
        </div>

        <div style={{ width: '48px', height: '2px', background: '#E2E8F0', borderRadius: '999px', margin: '2px 0' }} />

        <div style={{
          fontSize: '10px',
          fontWeight: '800',
          letterSpacing: '0.4px',
          color: '#64748B',
          textTransform: 'uppercase'
        }}>
          Towards a Smarter Bhopal for a Better Tomorrow
        </div>

        <div style={{
          fontSize: '11px',
          color: '#94A3B8'
        }}>
          Bhopal Smart City Development Corporation Initiative
        </div>
      </div>
    </div>
  );
}
