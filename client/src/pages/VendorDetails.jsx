import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useCompare } from '../context/CompareContext';
import { ReviewCard } from '../components/ReviewCard';
import {
  Star,
  MapPin,
  CheckCircle,
  Users,
  Home,
  ShieldCheck,
  Scale,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Building,
  Sparkles,
  Info
} from 'lucide-react';

export const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleCompare, isInCompare } = useCompare();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      try {
        const res = await api.getVendorById(id);
        if (res.success && res.data) {
          setVendor(res.data);
          if (res.data.services && res.data.services.length > 0) {
            setSelectedPackage(res.data.services[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>
          Loading Vendor Profile & Venue Specs...
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Vendor Not Found</h2>
        <Link to="/vendors" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Vendor Discovery
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(vendor.id);
  const venue = vendor.venue_details;
  const currentPrice = selectedPackage ? selectedPackage.price : vendor.starting_price;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Back link */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* Main Vendor Header Banner */}
      <div className="card" style={{ marginBottom: '32px', padding: '32px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>{vendor.category}</span>
              {vendor.is_verified && (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                  <CheckCircle size={14} /> Verified Vendor
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              {vendor.business_name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.92rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={16} color="#f59e0b" /> {vendor.address || vendor.city}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: '#b45309' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" /> {vendor.rating} ({vendor.review_count} Reviews)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => toggleCompare(vendor)}
              className={`btn ${inCompare ? 'btn-accent' : 'btn-outline'}`}
            >
              <Scale size={16} /> {inCompare ? 'In Comparison' : 'Add to Compare'}
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Details on Left, Booking Box on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* About Description */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>About This Vendor</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {vendor.description}
            </p>

            {vendor.supported_event_types && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Supported Events:</strong>
                {vendor.supported_event_types.map((type, idx) => (
                  <span key={idx} className="badge badge-neutral">{type}</span>
                ))}
              </div>
            )}
          </div>

          {/* Special Venue Capacity & Rooms Breakdown (if Venue) */}
          {venue && (
            <div className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Building size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem' }}>Venue Capacity & Facility Specifications</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>MAX GUEST CAPACITY</div>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>{venue.max_capacity} Guests</strong>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>MAIN BANQUET HALL</div>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>{venue.main_hall_capacity} Guests</strong>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>GUEST ROOMS</div>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>{venue.rooms_available} AC Rooms</strong>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>CATERING POLICY</div>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{venue.catering_policy}</strong>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'var(--text-main)' }}>Key Amenities & Infrastructure</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  {venue.facilities}
                </p>
              </div>
            </div>
          )}

          {/* Available Packages & Services */}
          {vendor.services && vendor.services.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Service Packages</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {vendor.services.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{pkg.service_name}</h4>
                          {pkg.is_popular && <span className="badge badge-warning">Popular</span>}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{pkg.description}</p>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                        <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{formatCurrency(pkg.price)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Verified Customer Reviews</h3>
              <span style={{ fontWeight: '700', color: '#b45309' }}>★ {vendor.rating} / 5.0</span>
            </div>

            {vendor.reviews && vendor.reviews.length > 0 ? (
              vendor.reviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to review after booking!</p>
            )}
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="card" style={{ borderTop: '5px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Instant Booking Summary</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Lock in your date with a transparent 20% advance payment.
            </p>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Package Amount</div>
              <div style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                {formatCurrency(currentPrice)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Advance Payable (20%): <strong>{formatCurrency(currentPrice * 0.20)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={15} /> Select Event Date
              </label>
              <input
                type="date"
                className="form-control"
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Link
                to={`/booking/summary?vendor_id=${vendor.id}&amount=${currentPrice}&date=${bookingDate}&category=${vendor.category}`}
                className="btn btn-primary btn-block btn-lg"
              >
                Proceed to Book Now
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#10b981" /> 100% Refundable Policy Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--accent)" /> Simulated Hackathon Payment Demo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
