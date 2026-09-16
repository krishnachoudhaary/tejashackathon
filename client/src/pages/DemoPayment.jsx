import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const DemoPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('booking_id');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedUPIApp, setSelectedUPIApp] = useState('GPay');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!bookingId) {
      navigate('/vendors');
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await api.getBookingById(bookingId);
        if (res.success && res.data) {
          setBooking(res.data);
        } else {
          setErrorMessage('Could not load booking details.');
        }
      } catch (err) {
        setErrorMessage('Error retrieving booking.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayAdvance = async () => {
    setProcessing(true);
    setErrorMessage('');

    try {
      const res = await api.processDemoPayment({
        booking_id: Number(bookingId),
        payment_type: 'ADVANCE',
        payment_method: `${paymentMethod} - ${selectedUPIApp} (Simulated)`
      });

      if (res.success && res.data) {
        // Redirect to booking confirmation screen with transaction data
        navigate(`/booking/confirmation?booking_id=${bookingId}&txn_ref=${res.data.transaction_reference}`);
      } else {
        setErrorMessage(res.message || 'Payment simulation failed.');
        setProcessing(false);
      }
    } catch (err) {
      setErrorMessage('Network error during simulated payment.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>
          Preparing Secure Payment Session...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '780px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--success-light)', color: '#065f46', padding: '4px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '0.8rem', marginBottom: '8px' }}>
          <Lock size={14} /> Simulated 256-Bit SSL Demo Gateway
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Complete Advance Payment</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Booking Ref: <strong>{booking?.booking_reference}</strong> • Vendor: <strong>{booking?.vendor?.business_name}</strong>
        </p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      {/* Amount Callout Banner */}
      <div className="card" style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '24px', marginBottom: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#c7d2fe', textTransform: 'uppercase' }}>20% Advance Payable Now</div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800' }}>
              {formatCurrency(booking?.advance_amount)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#e0e7ff' }}>
              Total Booking Value: {formatCurrency(booking?.total_amount)}
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '12px 18px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: '0.75rem', color: '#e0e7ff' }}>Remaining Balance Due Onsite:</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{formatCurrency(booking?.remaining_amount)}</div>
          </div>
        </div>
      </div>

      {/* Simulated Payment Methods Selector */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Select Payment Method (Simulated Demo)</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setPaymentMethod('UPI')}
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: paymentMethod === 'UPI' ? 'var(--primary-light)' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}
          >
            <Smartphone size={22} color="var(--primary)" />
            <span>UPI Apps</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('Card')}
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: paymentMethod === 'Card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: paymentMethod === 'Card' ? 'var(--primary-light)' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}
          >
            <CreditCard size={22} color="var(--accent)" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('NetBanking')}
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: paymentMethod === 'NetBanking' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: paymentMethod === 'NetBanking' ? 'var(--primary-light)' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}
          >
            <Building size={22} color="#0ea5e9" />
            <span>Net Banking</span>
          </button>
        </div>

        {/* UPI Apps selection */}
        {paymentMethod === 'UPI' && (
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '10px' }}>Popular UPI Handles:</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setSelectedUPIApp(app)}
                  className={`btn btn-sm ${selectedUPIApp === app ? 'btn-primary' : 'btn-outline'}`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#1e40af', marginBottom: '24px' }}>
          <Sparkles size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Hackathon Sandbox Simulator:</strong> Clicking below immediately triggers our backend transaction processor, confirms your booking, and generates an official demo receipt code (<code>EH-DEMO-XXXXXX</code>).
          </div>
        </div>

        {/* Primary Pay Button */}
        <button
          onClick={handlePayAdvance}
          disabled={processing}
          className="btn btn-primary btn-block btn-lg"
          style={{ padding: '18px', fontSize: '1.2rem' }}
        >
          {processing ? (
            <span className="animate-pulse">Processing Demo Transaction...</span>
          ) : (
            <span>Pay Advance ({formatCurrency(booking?.advance_amount)}) & Confirm</span>
          )}
        </button>
      </div>
    </div>
  );
};
