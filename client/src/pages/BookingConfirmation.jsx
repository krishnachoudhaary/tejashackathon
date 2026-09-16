import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, ShieldCheck, Sparkles, ArrowRight, Download, Home } from 'lucide-react';

export const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const txnRef = searchParams.get('txn_ref') || 'EH-DEMO-948210';

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '680px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '40px', borderTop: '6px solid var(--success)' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={40} />
        </div>

        <span className="badge badge-success" style={{ fontSize: '0.85rem', marginBottom: '10px' }}>
          Payment & Booking Confirmed
        </span>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Congratulations!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
          Your 20% advance payment has been successfully recorded and the vendor has received your booking confirmation.
        </p>

        {/* Transaction Reference Box */}
        <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Demo Transaction Ref:</span>
            <code style={{ fontWeight: '700', backgroundColor: '#ffffff', padding: '3px 8px', borderRadius: '6px' }}>{txnRef}</code>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Booking Status:</span>
            <strong style={{ color: 'var(--success)' }}>CONFIRMED (Advance Paid)</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Cancellation Protection:</span>
            <span style={{ color: '#065f46', fontWeight: '600' }}>Full Refundable Policy Active</span>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/my-event" className="btn btn-primary btn-lg btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>View in My Event Dashboard</span> <ArrowRight size={18} />
          </Link>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/vendors" className="btn btn-outline btn-block">
              Explore More Vendors
            </Link>
            <Link to="/" className="btn btn-outline btn-block">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
