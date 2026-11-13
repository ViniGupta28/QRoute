import React from 'react';
import { CheckCircle2, ArrowRight, ChevronRight, Zap, Leaf, MapPin, Radio, Bus, Car } from 'lucide-react';

export default function OnboardingScreen({ onFinish }) {
  const features = [
    {
      title: 'Faster travel with predictive traffic signals',
      sub: 'Dynamic green corridors across major junctions',
      icon: Radio,
      iconBg: '#059669'
    },
    {
      title: 'Real-time Bhopal metro & bus live tracking',
      sub: 'Sub-second telemetry with crowd-density alerts',
      icon: Bus,
      iconBg: '#059669'
    },
    {
      title: 'EV, BRTS, City Bus, Auto — all in one app',
      sub: 'Pick your mode, combine them, Q-Route handles the rest',
      icon: Car,
      iconBg: '#059669'
    },
    {
      title: 'Lower emissions & eco-carbon rewards',
      sub: 'Earn redeemable green points for every clean km',
      icon: Leaf,
      iconBg: '#059669'
    }
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100%',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 20px 24px',
      overflowY: 'auto'
    }}>
      {/* Top Header with official Q-ROUTE logo & Skip button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '4px',
        marginBottom: '10px'
      }}>
        <img 
          src="/qroute-logo.png" 
          alt="Q-Route" 
          style={{ height: '26px', objectFit: 'contain' }}
        />

        <button
          onClick={onFinish}
          style={{
            background: '#F1F5F9',
            border: 'none',
            fontSize: '12px',
            fontWeight: '700',
            color: '#334155',
            cursor: 'pointer',
            padding: '6px 14px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <span>Skip</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Hero Card: 100% Electric Fleet Transit */}
      <div style={{
        background: 'linear-gradient(180deg, #D1FAE5 0%, #E0F2FE 40%, #F1F5F9 100%)',
        borderRadius: '24px',
        padding: '16px 16px 14px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        border: '1px solid #A7F3D0'
      }}>
        {/* Top badges in hero */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{
            background: 'white',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: '800',
            color: '#065F46',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B368' }} />
            <span>100% ELECTRIC FLEET</span>
          </div>

          <div style={{
            background: '#015C3B',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Leaf size={10} />
            <span>Zero Emission</span>
          </div>
        </div>

        {/* Bus illustration canvas */}
        <div style={{
          width: '100%',
          height: '130px',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)'
        }}>
          {/* Sun */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '48px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#FDE047',
            boxShadow: '0 0 14px rgba(253, 224, 71, 0.6)'
          }} />

          {/* Hills & Bus Vector */}
          <svg viewBox="0 0 320 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            {/* Background rolling hills */}
            <path d="M 0 100 Q 80 70, 160 90 T 320 80 L 320 130 L 0 130 Z" fill="#BBF7D0" opacity="0.6" />
            
            {/* Trees */}
            <circle cx="50" cy="80" r="14" fill="#059669" />
            <rect x="47" y="94" width="6" height="16" fill="#78350F" />
            <circle cx="270" cy="76" r="16" fill="#10B981" />
            <rect x="267" y="92" width="6" height="18" fill="#78350F" />

            {/* Asphalt Road */}
            <rect x="0" y="105" width="320" height="25" fill="#334155" />
            <line x1="20" y1="117" x2="60" y2="117" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 6" />
            <line x1="90" y1="117" x2="150" y2="117" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 6" />
            <line x1="180" y1="117" x2="240" y2="117" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 6" />
            <line x1="270" y1="117" x2="310" y2="117" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 6" />

            {/* Q-ROUTE EV Bus */}
            <g transform="translate(95, 48)">
              <rect x="0" y="8" width="130" height="52" rx="10" fill="#00B368" />
              <rect x="6" y="12" width="118" height="20" rx="4" fill="#E0F2FE" />
              <rect x="12" y="15" width="22" height="14" rx="2" fill="#0284C7" />
              <rect x="40" y="15" width="24" height="14" rx="2" fill="#0284C7" />
              <rect x="70" y="15" width="24" height="14" rx="2" fill="#0284C7" />
              <rect x="100" y="15" width="20" height="14" rx="2" fill="#38BDF8" />
              <text x="24" y="46" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">Q-ROUTE EV</text>
              <circle cx="125" cy="42" r="3" fill="#FEF08A" />
              <circle cx="28" cy="60" r="10" fill="#0F172A" />
              <circle cx="28" cy="60" r="4" fill="#E2E8F0" />
              <circle cx="102" cy="60" r="10" fill="#0F172A" />
              <circle cx="102" cy="60" r="4" fill="#E2E8F0" />
            </g>
          </svg>
        </div>

        {/* Footer text in hero */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          fontSize: '11px',
          fontWeight: '700'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#006C49' }}>
            <Zap size={13} color="#00B368" />
            <span>Smart Smart-Grid Connected</span>
          </div>
          <span style={{ color: '#475569' }}>Bhopal Smart City Mission</span>
        </div>
      </div>

      {/* Headline & Subtitle */}
      <div style={{ marginTop: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: '800',
          color: '#00B368',
          letterSpacing: '0.2px',
          marginBottom: '4px'
        }}>
          <MapPin size={13} />
          <span>Next-Gen Urban Transit</span>
        </div>

        <h1 style={{
          fontSize: '22px',
          fontWeight: '900',
          color: '#0F172A',
          lineHeight: '1.25',
          marginBottom: '6px'
        }}>
          Smarter Mobility for a Greener Bhopal
        </h1>

        <p style={{
          fontSize: '12px',
          color: '#64748B',
          lineHeight: '1.5'
        }}>
          AI + Quantum-inspired optimization to save your time, reduce congestion and make our city cleaner.
        </p>
      </div>

      {/* 4 Feature Checklist Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#00B368',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={16} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  {item.sub}
                </div>
              </div>

              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#006C49',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section with 4 Dots & Get Started Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        {/* 4-Dot Carousel */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '24px', height: '6px', borderRadius: '999px', background: '#006C49' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }} />
        </div>

        {/* Primary CTA */}
        <button
          onClick={onFinish}
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
            boxShadow: '0 8px 24px rgba(0, 108, 73, 0.3)'
          }}
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
