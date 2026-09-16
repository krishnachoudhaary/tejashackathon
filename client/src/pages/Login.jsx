import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const from = location.state?.from?.pathname || (res.user?.role === 'VENDOR' ? '/vendor/dashboard' : '/planner');
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.message || 'Invalid email or password.');
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'CUSTOMER') {
      setEmail('demo@eventhub.com');
      setPassword('Password123!');
    } else {
      setEmail('vendor@eventhub.com');
      setPassword('Password123!');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Calendar size={26} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Login to EventHub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Plan Smart. Spend Smart. Celebrate Better.
          </p>
        </div>

        {/* 1-Click Demo Accounts Selector */}
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            1-Click Demo Credentials:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoFill('CUSTOMER')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px' }}
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('VENDOR')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px' }}
            >
              Demo Vendor
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '8px', marginBottom: '16px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};
