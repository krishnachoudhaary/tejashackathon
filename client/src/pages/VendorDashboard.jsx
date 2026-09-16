import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Building,
  Users,
  Home,
  CheckCircle2,
  Clock,
  Wallet,
  Settings,
  TrendingUp,
  Save,
  Check
} from 'lucide-react';

export const VendorDashboard = () => {
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Profile & Venue
  const [formData, setFormData] = useState({
    business_name: '',
    category: 'Venue',
    city: 'Patna',
    address: '',
    description: '',
    starting_price: 70000,
    price_unit: 'per day',
    contact_phone: '+91 9835012345',
    contact_email: 'vendor@eventhub.com',
    max_capacity: 400,
    main_hall_capacity: 300,
    rooms_available: 12,
    lawn_available: true,
    facilities: 'Centrally AC, 12 Luxury Rooms, 10000 sq.ft Lawn, Bridal Suite, Stage Setup, Valet Parking, Power Backup 24x7'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, vendorsRes] = await Promise.all([
          api.getBookings(),
          api.getVendors({ search: 'Patliputra' })
        ]);

        if (bookingsRes.success && bookingsRes.data) {
          setBookings(bookingsRes.data.bookings || []);
        }

        if (vendorsRes.success && vendorsRes.data?.vendors?.length > 0) {
          const v = vendorsRes.data.vendors[0];
          setVendor(v);
          const venue = v.venue_details || {};
          setFormData({
            business_name: v.business_name,
            category: v.category,
            city: v.city,
            address: v.address || '',
            description: v.description || '',
            starting_price: v.starting_price,
            price_unit: v.price_unit,
            contact_phone: v.contact_phone || '',
            contact_email: v.contact_email || '',
            max_capacity: venue.max_capacity || 400,
            main_hall_capacity: venue.main_hall_capacity || 300,
            rooms_available: venue.rooms_available || 12,
            lawn_available: venue.lawn_available !== undefined ? venue.lawn_available : true,
            facilities: venue.facilities || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await api.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setBookings(bookings.map((b) => b.id === bookingId ? { ...b, booking_status: newStatus } : b));
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        business_name: formData.business_name,
        category: formData.category,
        city: formData.city,
        address: formData.address,
        description: formData.description,
        starting_price: formData.starting_price,
        price_unit: formData.price_unit,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        venue_details: {
          max_capacity: formData.max_capacity,
          main_hall_capacity: formData.main_hall_capacity,
          rooms_available: formData.rooms_available,
          lawn_available: formData.lawn_available,
          facilities: formData.facilities
        }
      };

      const res = await api.updateVendorProfile(payload);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  // Commission & Financial KPI Calculations
  const confirmedBookings = bookings.filter((b) => b.booking_status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const platformCommission = totalRevenue * 0.10; // 10%
  const netVendorPayout = totalRevenue - platformCommission;

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>
          Loading Vendor Operations Center...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '30px', marginBottom: '32px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
              Partner Vendor Portal
            </span>
            <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginTop: '6px', marginBottom: '4px' }}>
              {formData.business_name || 'Vendor Dashboard'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              {formData.city} • Manage incoming bookings, venue capacity specs, and net earnings.
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Platform Commission Model</div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>10% Platform Fee</strong>
          </div>
        </div>
      </div>

      {/* Financial Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL BOOKING VALUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CONFIRMED ORDERS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
            {confirmedBookings.length}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>EVENTHUB COMMISSION (10%)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', marginTop: '4px' }}>
            {formatCurrency(platformCommission)}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: '600' }}>NET VENDOR PAYOUT</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            {formatCurrency(netVendorPayout)}
          </div>
        </div>
      </div>

      {/* 2-Column: Customer Bookings & Venue Capacity Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        {/* Customer Bookings & Enquiries */}
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Incoming Bookings & Enquiries</h2>

          {bookings.length === 0 ? (
            <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No bookings received yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bookings.map((b) => (
                <div key={b.id} className="card" style={{ padding: '18px', borderLeft: b.booking_status === 'CONFIRMED' ? '4px solid var(--success)' : '4px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{b.service_category}</span>
                      <h4 style={{ fontSize: '1.1rem', marginTop: '4px' }}>{b.user_name || 'Customer Booking'}</h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Date: {formatDate(b.event_date)} • Ref: <strong>{b.booking_reference}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>{formatCurrency(b.total_amount)}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Adv Paid: {formatCurrency(b.advance_amount)}</div>
                    </div>
                  </div>

                  {b.special_notes && (
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Note: "{b.special_notes}"
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <span className={`badge ${b.booking_status === 'CONFIRMED' ? 'badge-success' : b.booking_status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'}`}>
                      {b.booking_status}
                    </span>

                    {b.booking_status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')}
                        className="btn btn-primary btn-sm"
                      >
                        Accept & Confirm
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Venue Specs & Rates Manager */}
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Venue Specs & Pricing Editor</h2>

          <form onSubmit={handleProfileSave} className="card" style={{ padding: '24px' }}>
            {saveSuccess && (
              <div className="alert alert-success" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> Vendor details updated successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Business / Hall Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Starting Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.starting_price}
                  onChange={(e) => setFormData({ ...formData, starting_price: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Venue Capacity Specs */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={16} color="var(--primary)" /> Venue Capacity & Guest Rooms
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Max Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({ ...formData, max_capacity: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Main Hall</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.main_hall_capacity}
                    onChange={(e) => setFormData({ ...formData, main_hall_capacity: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Guest Rooms</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.rooms_available}
                    onChange={(e) => setFormData({ ...formData, rooms_available: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Amenities / Infrastructure</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-block"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile & Capacity Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
