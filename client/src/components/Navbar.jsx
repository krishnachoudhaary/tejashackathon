import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { Calendar, Sparkles, Scale, User, LogOut, Menu, X, CheckCircle2 } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { compareList } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo & Tagline */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              EVENT<span style={{ color: 'var(--primary)' }}>HUB</span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Tier 2/3</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.01em' }}>
              Plan Smart. Spend Smart. Celebrate Better.
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link
            to="/planner"
            style={{
              fontWeight: '600',
              fontSize: '0.92rem',
              color: isActive('/planner') ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={17} style={{ color: 'var(--accent)' }} />
            Plan My Event
          </Link>

          <Link
            to="/vendors"
            style={{
              fontWeight: '600',
              fontSize: '0.92rem',
              color: isActive('/vendors') ? 'var(--primary)' : 'var(--text-main)'
            }}
          >
            Explore Vendors
          </Link>

          <Link
            to="/compare"
            style={{
              fontWeight: '600',
              fontSize: '0.92rem',
              color: isActive('/compare') ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Scale size={17} />
            Compare
            {compareList.length > 0 && (
              <span style={{ backgroundColor: 'var(--primary)', color: '#fff', fontSize: '0.72rem', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>
                {compareList.length}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-event"
              style={{
                fontWeight: '600',
                fontSize: '0.92rem',
                color: isActive('/my-event') ? 'var(--primary)' : 'var(--text-main)'
              }}
            >
              My Event
            </Link>
          )}
        </nav>

        {/* User Auth CTA */}
        <div style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '14px' }} className="desktop-nav">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to={user?.role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard'}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <User size={15} />
                <span>{user?.name?.split(' ')[0]} ({user?.role === 'VENDOR' ? 'Vendor' : 'User'})</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout" style={{ padding: '6px 10px' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '8px' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link to="/planner" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '8px 0', color: 'var(--primary)' }}>
            ✨ Plan My Event
          </Link>
          <Link to="/vendors" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '8px 0' }}>
            Explore Vendors
          </Link>
          <Link to="/compare" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '8px 0' }}>
            Compare Vendors ({compareList.length})
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/my-event" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '8px 0' }}>
                My Event Plan
              </Link>
              <Link to={user?.role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '8px 0' }}>
                Dashboard ({user?.name})
              </Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger btn-sm btn-block">
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-block">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
