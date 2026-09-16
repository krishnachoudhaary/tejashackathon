import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PaymentSummary } from '../components/PaymentSummary';
import { Calendar, MapPin, ShieldCheck, ArrowRight, ArrowLeft, Clock } from 'lucide-react';

export const BookingSummary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const vendorId = searchParams.get('vendor_id');
  const eventId = searchParams.get('event_id');
  const initialAmount = searchParams.get('amount') || 70000;
  const initialDate = searchParams.get('date') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const serviceCategory = searchParams.get('category');

  const [vendor, setVendor] = useState(null);
  const [eventDate, setEventDate] = useState(initialDate);
  const [specialNotes, setSpecialNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totalAmount = Number(initialAmount);
  const advanceRate = 0.20;
  const advanceAmount = totalAmount * advanceRate;
  const remainingAmount = totalAmount - advanceAmount;

  useEffect(() => {
    if (!vendorId) {
      navigate('/vendors');
      return;
    }

    const fetchVendor = async () => {
      try {
        const res = await api.getVendorById(vendorId);
        if (res.success && res.data) {
          setVendor(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId]);

  const handleProceedToPayment = async () => {
    setErrorMessage('');

    if (!isAuthenticated) {
      // Auto-authenticate as demo customer for smooth hackathon evaluation
      const loginRes = await api.login('demo@eventhub.com', 'Password123!');
      if (!loginRes.success) {
        navigate('/login');
        return;
      }
    }

    setSubmitting(true);
    try {
      const bookingData = {
        vendor_id: Number(vendorId),
        event_id: eventId ? Number(eventId) : null,
        event_date: eventDate,
        service_category: serviceCategory || vendor?.category || 'General Service',
        total_amount: totalAmount,
        special_notes: specialNotes
      };

      const res = await api.createBooking(bookingData);
      if (res.success && res.data) {
        navigate(`/payment/demo?booking_id=${res.data.id}`);
      } else {
        setErrorMessage(res.message || 'Failed to create booking.');
      }
    } catch (err) {
      setErrorMessage('Network error while initiating booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>
          Loading Booking Details...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '840px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Step 1 of 2: Booking Review</span>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Review Your Booking</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Confirm service parameters and advance requirements before proceeding to simulated payment.
        </p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      <div className="card" style={{ padding: '30px', marginBottom: '24px' }}>
        {/* Vendor & Event Details */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{vendor?.category}</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{vendor?.business_name}</h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <MapPin size={15} color="#f59e0b" /> {vendor?.city} ({vendor?.address})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Package</div>
              <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>{formatCurrency(totalAmount)}</strong>
            </div>
          </div>
        </div>

        {/* Date and Notes Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={15} /> Event Celebration Date
            </label>
            <input
              type="date"
              className="form-control"
              value={eventDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Special Requests / Instructions</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Stage color theme, extra guest rooms"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Payment Summary Breakdown */}
        <PaymentSummary
          totalAmount={totalAmount}
          advanceAmount={advanceAmount}
          remainingAmount={remainingAmount}
          advanceRate={advanceRate}
        />

        {/* Action Button */}
        <div style={{ marginTop: '28px' }}>
          <button
            onClick={handleProceedToPayment}
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg"
            style={{ padding: '16px', fontSize: '1.1rem' }}
          >
            {submitting ? 'Creating Booking...' : `Proceed to Pay Advance (${formatCurrency(advanceAmount)})`}
          </button>
        </div>
      </div>
    </div>
  );
};
