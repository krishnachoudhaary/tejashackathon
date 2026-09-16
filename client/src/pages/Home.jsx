import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Wallet,
  Scale,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Users,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Clock
} from 'lucide-react';
import heroImage from '../assets/hero_event.jpg';

export const Home = () => {
  const categories = [
    { name: 'Venues & Banquets', count: '7+ Venues', icon: '🏰', desc: 'Lawn, AC Banquet Halls, Rooms', path: '/vendors?category=Venue' },
    { name: 'Gourmet Catering', count: '4+ Caterers', icon: '🍲', desc: 'North Indian, Maithili, Live Counters', path: '/vendors?category=Catering' },
    { name: 'Theme Decoration', count: '4+ Decorators', icon: '✨', desc: 'Floral Mandaps, LED Tunnel Entry', path: '/vendors?category=Decoration' },
    { name: 'Cinematic Photo & 4K', count: '3+ Studios', icon: '📸', desc: 'Drone shoots, Candid albums', path: '/vendors?category=Photography' },
    { name: 'High-Energy DJ & Sound', count: '3+ DJ Crews', icon: '🎵', desc: 'Moving heads, LED dance floor', path: '/vendors?category=DJ' },
    { name: 'Bridal Makeover', count: '2+ Studios', icon: '💄', desc: 'HD Airbrush, Saree Draping', path: '/vendors?category=Makeup' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Enter Event Requirements',
      desc: 'Set your event type (Wedding, Birthday), guest count, city, and total budget.',
      icon: <Calendar size={24} color="var(--primary)" />
    },
    {
      num: '02',
      title: 'Smart Match & Complete Plan',
      desc: 'Our rule-based engine generates a balanced vendor package that fits exactly within budget.',
      icon: <Sparkles size={24} color="var(--accent)" />
    },
    {
      num: '03',
      title: 'Compare & Customize',
      desc: 'Compare venues side-by-side by hall capacity, room count, and pricing. Swap vendors live.',
      icon: <Scale size={24} color="#0ea5e9" />
    },
    {
      num: '04',
      title: '20% Advance Booking',
      desc: 'Confirm trusted local vendors with simulated advance payments and full cancellation protection.',
      icon: <ShieldCheck size={24} color="#10b981" />
    }
  ];

  const differentiators = [
    {
      title: 'Budget-Driven Vendor Matching',
      desc: 'Traditional directories just give you phone numbers. EventHub allocates your ₹3,00,000 budget across Venue, Catering, Decor, Photo, and DJ dynamically.',
      icon: <Wallet size={26} color="var(--primary)" />
    },
    {
      title: 'Venue Capacity & Guest Rooms',
      desc: 'Never book a venue blindly. See exact main hall capacity, lawn access, and outstation guest room counts for Tier-2/3 family events.',
      icon: <Users size={26} color="var(--accent)" />
    },
    {
      title: 'Transparent 20% Advance & Refund',
      desc: 'Pay a predictable 20% advance. If plans change, our transparent cancellation policy computes exact refund amounts with zero hidden deductions.',
      icon: <ShieldCheck size={26} color="#10b981" />
    },
    {
      title: 'Tier-2 & Tier-3 City First',
      desc: 'Tailored for Patna, Gaya, Muzaffarpur, Bhagalpur, Begusarai, Nalanda, and Sheikhpura with local pricing and verified regional vendors.',
      icon: <MapPin size={26} color="#ec4899" />
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid var(--border-color)',
        paddingTop: '60px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}>
              <Sparkles size={16} /> Tier-2 & Tier-3 India's Smart Event Platform
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: '1.15', marginBottom: '18px', color: '#0f172a' }}>
              Plan Smart. Spend Smart. <br />
              <span style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Celebrate Better.
              </span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
              EventHub doesn't just help you <strong>FIND</strong> vendors — it helps you <strong>PLAN</strong> your entire celebration within your budget with rule-based smart matching, venue capacity specs, and verified bookings.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
              <Link to="/planner" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={19} /> Plan My Event
              </Link>
              <Link to="/vendors" className="btn btn-outline btn-lg">
                Explore Vendors
              </Link>
            </div>

            {/* Factual Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10b981" /> 16+ Verified Tier-2/3 Vendors
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10b981" /> Explainable Smart Match
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10b981" /> 20% Advance Guarantee
              </div>
            </div>
          </div>

          {/* Hero Image & Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '4px solid #ffffff',
              maxHeight: '460px'
            }}>
              <img
                src={heroImage}
                alt="Celebration Setup"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Floating Live Smart Plan Badge */}
            <div className="card" style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              padding: '16px 20px',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '280px',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Wedding in Patna</div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>₹3,00,000 Budget Plan</strong>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#166534', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>
                ✓ 5 Vendors Auto-Matched & Saved ₹40,000
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How EventHub Works */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Simple 4-Step Process</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px' }}>How EventHub Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              From initial guest count to confirmed advance bookings, everything is streamlined in one smart interface.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {steps.map((s, idx) => (
              <div key={idx} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--bg-subtle)', position: 'absolute', top: '10px', right: '14px', userSelect: 'none' }}>
                  {s.num}
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why EventHub is Different (The Core Differentiators) */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
            <span className="badge badge-warning" style={{ marginBottom: '10px' }}>The Core Differentiator</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px' }}>Why EventHub isn't just another directory</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Unlike generic listing sites that leave you stranded with disconnected phone numbers, EventHub acts as your automated event planning architect.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {differentiators.map((diff, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {diff.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{diff.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Exploration Grid */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Local Specialists</span>
              <h2 style={{ fontSize: '2.2rem' }}>Explore Event Services</h2>
            </div>
            <Link to="/vendors" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View All 16+ Vendors</span> <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {categories.map((cat, idx) => (
              <Link key={idx} to={cat.path} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '2.2rem', width: '60px', height: '60px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{cat.name}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>{cat.count}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap / Coming Soon */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '36px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: '6px' }}>Product Roadmap</span>
                <h3 style={{ fontSize: '1.4rem' }}>Future Platform Enhancements (Coming Soon)</h3>
              </div>
              <span className="badge badge-primary">Version 2.0 Vision</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '0.88rem' }}>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>🤖 AI Planning Assistant</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Interactive conversational event planner with real-time budget adjustments.</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>💳 Live Razorpay / UPI Gateway</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Seamless escrow payment releases for vendor milestones.</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>📜 Digital Smart Contracts</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Legally binding terms and condition sign-off for client & vendor peace of mind.</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>🏢 B2B Corporate Event Suites</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Conference halls, catering GST billing, and corporate retreat packages.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ padding: '70px 0', backgroundColor: 'var(--primary)', color: '#ffffff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '14px' }}>Ready to Plan Your Next Celebration?</h2>
          <p style={{ fontSize: '1.05rem', color: '#c7d2fe', marginBottom: '28px' }}>
            Experience rule-based Smart Matching, transparent 20% advance booking, and live budget tracking designed specifically for Tier-2 and Tier-3 cities.
          </p>
          <Link to="/planner" className="btn btn-accent btn-lg" style={{ fontWeight: '700' }}>
            ✨ Start Event Plan Now
          </Link>
        </div>
      </section>
    </div>
  );
};
