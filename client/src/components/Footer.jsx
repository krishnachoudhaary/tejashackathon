import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Heart, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', paddingTop: '60px', paddingBottom: '30px', marginTop: '80px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#fff' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>EVENT<span style={{ color: '#818cf8' }}>HUB</span></span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
              "Plan Smart. Spend Smart. Celebrate Better."
              <br />
              India's premier budget-smart event planning and vendor booking platform designed specifically for Tier-2 and Tier-3 cities.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> 100% Transparent Pricing & Policy
            </div>
          </div>

          {/* Tier-2/3 Cities Focus */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '16px' }}>Cities We Serve</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#f59e0b" /> Patna (Capital Region)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#f59e0b" /> Gaya & Bodhgaya</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#f59e0b" /> Muzaffarpur</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#f59e0b" /> Bhagalpur</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#f59e0b" /> Begusarai, Nalanda & Sheikhpura</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '16px' }}>Event Planning</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li><Link to="/planner" style={{ color: '#cbd5e1' }}>Smart Event Planner</Link></li>
              <li><Link to="/vendors" style={{ color: '#cbd5e1' }}>Find Venues & Caterers</Link></li>
              <li><Link to="/compare" style={{ color: '#cbd5e1' }}>Side-by-Side Comparison</Link></li>
              <li><Link to="/budget-planner" style={{ color: '#cbd5e1' }}>Budget Optimizer</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Vendor Portal</Link></li>
            </ul>
          </div>

          {/* Business & Model */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '16px' }}>Business Model</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '10px' }}>
              EventHub charges a fair 10% commission on confirmed vendor bookings. Customers pay a transparent 20% advance with clear, automated cancellation policies.
            </p>
            <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#93c5fd' }}>
              Built for Hackathon Demo • Zero Fake Buttons
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
          <div>© {new Date().getFullYear()} EventHub. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Crafted with <Heart size={14} color="#ef4444" /> for Tier-2 & Tier-3 India
          </div>
        </div>
      </div>
    </footer>
  );
};
