import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { BudgetCard } from '../components/BudgetCard';
import { VendorCard } from '../components/VendorCard';
import { Sparkles, Calendar, MapPin, Users, Wallet, CheckSquare, ArrowRight, RefreshCw, Layers, CheckCircle } from 'lucide-react';

const CITIES = ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Begusarai', 'Nalanda', 'Sheikhpura'];
const EVENT_TYPES = ['Wedding', 'Birthday', 'Engagement', 'Corporate', 'Anniversary'];
const AVAILABLE_SERVICES = ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ', 'Makeup'];

export const EventPlanner = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    event_name: 'Grand Family Wedding',
    event_type: 'Wedding',
    city: 'Patna',
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guest_count: 250,
    total_budget: 300000,
    required_services: ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ']
  });

  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeReplaceCategory, setActiveReplaceCategory] = useState(null);

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const exists = prev.required_services.includes(service);
      const updated = exists
        ? prev.required_services.filter((s) => s !== service)
        : [...prev.required_services, service];
      return { ...prev, required_services: updated };
    });
  };

  const handlePresetBudget = (amount) => {
    setFormData((prev) => ({ ...prev, total_budget: amount }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.required_services.length === 0) {
      setErrorMessage('Please select at least one required service category.');
      return;
    }

    if (!isAuthenticated) {
      // Auto login as demo customer if not authenticated to provide smooth hackathon experience
      const loginRes = await api.login({ email: 'demo@eventhub.com', password: 'Password123!' });
      if (loginRes.success && loginRes.data) {
        localStorage.setItem('eventhub_token', loginRes.data.token);
      }
    }

    setLoading(true);
    try {
      const res = await api.createEventPlan(formData);
      if (res.success && res.data) {
        setGeneratedPlan(res.data);
      } else {
        setErrorMessage(res.message || 'Failed to generate event plan.');
      }
    } catch (err) {
      setErrorMessage('Network error while planning event.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceVendor = async (category, newVendorId) => {
    if (!generatedPlan?.id) return;
    try {
      const res = await api.replaceEventVendor(generatedPlan.id, category, newVendorId);
      if (res.success && res.data) {
        setGeneratedPlan((prev) => ({
          ...prev,
          ...res.data,
          smart_matches: prev.smart_matches,
          category_budget_targets: prev.category_budget_targets
        }));
        setActiveReplaceCategory(null);
      }
    } catch (err) {
      alert('Failed to replace vendor.');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '0.82rem', marginBottom: '12px' }}>
          <Sparkles size={15} /> Automated Smart Event Architect
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>Smart Event Planner</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Tell us about your upcoming celebration. EventHub's rule-based engine will calculate optimal budget allocations and match verified vendors that fit within your budget.
        </p>
      </div>

      {!generatedPlan ? (
        /* Event Configuration Form */
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
          {errorMessage && (
            <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Event Type */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} color="var(--primary)" /> Event Type
                </label>
                <select
                  className="form-control"
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* City / Location */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="#f59e0b" /> City / Region (Bihar)
                </label>
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

              {/* Event Date */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="var(--primary)" /> Event Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.event_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>

              {/* Guest Count */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} color="#0ea5e9" /> Expected Guests: <strong>{formData.guest_count}</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="30"
                  max="1000"
                  step="10"
                  value={formData.guest_count}
                  onChange={(e) => setFormData({ ...formData, guest_count: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Total Budget Selection */}
            <div className="form-group" style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <Wallet size={15} color="#10b981" /> Total Event Budget
                </label>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                  {formatCurrency(formData.total_budget)}
                </strong>
              </div>

              <input
                type="range"
                min="100000"
                max="1000000"
                step="25000"
                value={formData.total_budget}
                onChange={(e) => setFormData({ ...formData, total_budget: Number(e.target.value) })}
                style={{ width: '100%', marginBottom: '12px' }}
              />

              {/* Preset Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[150000, 300000, 500000, 750000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePresetBudget(amt)}
                    className={`btn btn-sm ${formData.total_budget === amt ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Services Checkboxes */}
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <CheckSquare size={15} color="var(--primary)" /> Required Service Categories
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {AVAILABLE_SERVICES.map((srv) => {
                  const isChecked = formData.required_services.includes(srv);
                  return (
                    <label
                      key={srv}
                      onClick={() => handleServiceToggle(srv)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: isChecked ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isChecked ? 'var(--primary-light)' : '#ffffff',
                        cursor: 'pointer',
                        fontWeight: isChecked ? '700' : '500',
                        color: isChecked ? 'var(--primary)' : 'var(--text-main)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span>{srv}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg btn-block"
              style={{ padding: '16px', fontSize: '1.1rem' }}
            >
              {loading ? (
                <span>Generating Smart Event Plan...</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Sparkles size={20} /> Generate Budget-Smart Plan
                </span>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Generated Complete Event Plan Dashboard */
        <div>
          {/* Top Reset / Reconfigure Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
                {generatedPlan.event_name || 'Custom Event Plan'}
              </h2>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {generatedPlan.event_type} • {generatedPlan.city} • {generatedPlan.guest_count} Guests • {generatedPlan.event_date}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setGeneratedPlan(null)}
                className="btn btn-outline btn-sm"
              >
                <RefreshCw size={14} /> Reconfigure Parameters
              </button>
              <Link to="/my-event" className="btn btn-secondary btn-sm">
                View in My Event Dashboard
              </Link>
            </div>
          </div>

          {/* Dynamic Budget Tracker Card */}
          <BudgetCard
            totalBudget={generatedPlan.total_budget}
            allocatedBudget={generatedPlan.budget_status?.allocated_budget ?? generatedPlan.allocated_budget}
            remainingBudget={generatedPlan.budget_status?.remaining_budget ?? generatedPlan.remaining_budget}
            isWithinBudget={generatedPlan.budget_status?.is_within_budget ?? true}
            message={generatedPlan.budget_status?.message}
          />

          {/* Category-Wise Recommended Plan */}
          <h3 style={{ fontSize: '1.4rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--primary)" />
            Recommended Vendor Combinations
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {generatedPlan.selected_vendors?.map((ev) => {
              const vendor = ev.vendor;
              const matches = generatedPlan.smart_matches?.[ev.category] || [];
              const topMatch = matches.find((m) => m.vendor_id === vendor?.id) || matches[0];

              return (
                <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge badge-primary">{ev.category}</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                        {formatCurrency(ev.allocated_price)}
                      </strong>
                    </div>

                    {vendor ? (
                      <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{vendor.business_name}</h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          {vendor.city} • Rating {vendor.rating} ★ ({vendor.review_count} reviews)
                        </div>

                        {/* Smart Match Reasons */}
                        {topMatch && (
                          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem' }}>
                            <div style={{ fontWeight: '700', color: '#065f46', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Sparkles size={13} /> {topMatch.match_score}% Smart Match
                            </div>
                            {topMatch.reasons?.slice(0, 2).map((r, idx) => (
                              <div key={idx} style={{ color: 'var(--text-muted)' }}>✓ {r}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)' }}>No vendor selected for this category.</p>
                    )}
                  </div>

                  {/* Actions for this Category */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => setActiveReplaceCategory(activeReplaceCategory === ev.category ? null : ev.category)}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                    >
                      <RefreshCw size={14} /> Swap Vendor
                    </button>

                    <Link
                      to={`/booking/summary?vendor_id=${vendor?.id}&event_id=${generatedPlan.id}&amount=${ev.allocated_price}&date=${generatedPlan.event_date}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Book Now (20% Adv)
                    </Link>
                  </div>

                  {/* Replace Vendor Dropdown / Candidates List */}
                  {activeReplaceCategory === ev.category && (
                    <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed var(--primary)' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
                        Select Alternative {ev.category} Vendor:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                        {matches.map((m) => (
                          <div
                            key={m.vendor_id}
                            onClick={() => handleReplaceVendor(ev.category, m.vendor_id)}
                            style={{
                              padding: '8px 10px',
                              backgroundColor: m.vendor_id === vendor?.id ? 'var(--primary-light)' : '#ffffff',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div>
                              <strong>{m.business_name}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.match_score}% Match • {m.rating} ★</div>
                            </div>
                            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
                              {formatCurrency(m.starting_price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Primary Next Steps */}
          <div className="card" style={{ backgroundColor: '#ffffff', textAlign: 'center', padding: '36px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Your Event Plan is Ready!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
              You can confirm individual vendors with a 20% advance payment or manage your event in the central dashboard.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/my-event" className="btn btn-primary btn-lg">
                Go to My Event Dashboard
              </Link>
              <Link to="/compare" className="btn btn-outline btn-lg">
                Compare Alternative Vendors
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
