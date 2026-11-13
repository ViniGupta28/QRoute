import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, X, MapPin, Radio } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '380px',
        width: '100%',
        padding: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1px solid #FEE2E2',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} color="#64748B" />
        </button>

        {/* SOS Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertOctagon size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#991B1B' }}>Emergency & SOS</h3>
            <p style={{ fontSize: '11px', color: '#64748B' }}>Bhopal Smart City Emergency Dispatch</p>
          </div>
        </div>

        {/* GPS Tag */}
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '12px',
          padding: '10px 12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Radio size={16} color="#DC2626" className="pulse-dot" />
          <div style={{ fontSize: '11px', color: '#7F1D1D', fontWeight: '600' }}>
            Broadcasting Live Location: <strong>MP Nagar Zone-1, Bhopal (23.2332° N, 77.4343° E)</strong>
          </div>
        </div>

        {/* Emergency Call Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <a 
            href="tel:112"
            style={emergencyCallLinkStyle}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#DC2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneCall size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Bhopal Police / Emergency</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Dial 112 (Immediate response)</div>
              </div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#DC2626' }}>Call 112</span>
          </a>

          <a 
            href="tel:108"
            style={emergencyCallLinkStyle}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Smart City Ambulance</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Dial 108 (Traffic green corridor)</div>
              </div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#2563EB' }}>Call 108</span>
          </a>
        </div>

        <button 
          onClick={() => {
            alert('SOS alert broadcasted to Bhopal Smart Transit Command & emergency contacts.');
            onClose();
          }}
          style={{
            width: '100%',
            background: '#DC2626',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            padding: '14px',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
          }}
        >
          BROADCAST SOS ALERT
        </button>
      </div>
    </div>
  );
}

const emergencyCallLinkStyle = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '10px 12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textDecoration: 'none'
};
