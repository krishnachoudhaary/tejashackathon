import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Mail, Lock, Phone, MapPin } from 'lucide-react';

const CITIES = ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Begusarai', 'Nalanda', 'Sheikhpura'];

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
    city: 'Patna'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      if (formData.role === 'VENDOR') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/planner');
      }
    } else {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="container" style={{ padding: '50px 20px', maxWidth: '520px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Calendar size={26} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Create EventHub Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Join India's smart budget event planning ecosystem.
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">I am registering as a:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: formData.role === 'CUSTOMER' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: formData.role === 'CUSTOMER' ? 'var(--primary-light)' : '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Event Host (Customer)
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: formData.role === 'VENDOR' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: formData.role === 'VENDOR' ? 'var(--primary-light)' : '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Event Vendor / Partner
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name / Business Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City (Bihar)</label>
              <select
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '8px', marginBottom: '16px' }}
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};
