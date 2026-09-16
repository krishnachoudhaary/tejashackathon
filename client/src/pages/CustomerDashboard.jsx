import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { RefundStatus } from '../components/RefundStatus';
import {
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, bookingsRes] = await Promise.all([
          api.getUserEvents(),
          api.getBookings()
        ]);
        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data.events || []);
        }
        if (bookingsRes.success && bookingsRes.data) {
          setBookings(bookingsRes.data.bookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeBookings = bookings.filter((b) => b.booking_status === 'CONFIRMED');
  const cancelledBookings = bookings.filter((b) => b.booking_status === 'CANCELLED');
  const totalSpentAdvance = activeBookings.reduce((acc, curr) => acc + Number(curr.advance_amount || 0), 0);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '30px', marginBottom: '32px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700' }}>
              Customer Portal
            </span>
            <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginTop: '6px', marginBottom: '4px' }}>
              Welcome back, {user?.name}!
            </h1>
            <p style={{ color: '#c7d2fe', fontSize: '0.92rem' }}>
              Manage your event plans, track 20% advance payments, and monitor verified bookings.
            </p>
          </div>

          <Link to="/planner" className="btn btn-accent btn-lg">
            <Sparkles size={18} /> Plan New Event
          </Link>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>MY EVENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {events.length}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CONFIRMED BOOKINGS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
            {activeBookings.length}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL ADVANCE PAID</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            {formatCurrency(totalSpentAdvance)}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CANCELLED / REFUNDS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', marginTop: '4px' }}>
            {cancelledBookings.length}
          </div>
        </div>
      </div>

      {/* Bookings List Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '18px' }}>Your Bookings & Payments</h2>

        {bookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No bookings placed yet.</p>
            <Link to="/vendors" className="btn btn-primary btn-sm">Explore Vendors</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((b) => (
              <div key={b.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge badge-primary">{b.service_category}</span>
                      <span className={`badge ${b.booking_status === 'CONFIRMED' ? 'badge-success' : b.booking_status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'}`}>
                        {b.booking_status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{b.vendor?.business_name}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
                      <span>Ref: <strong>{b.booking_reference}</strong></span>
                      <span>Date: {formatDate(b.event_date)}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{formatCurrency(b.total_amount)}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '2px' }}>
                      Advance Paid: {formatCurrency(b.advance_amount)}
                    </div>
                  </div>
                </div>

                {/* If refunds exist, display simulated refund details */}
                {b.refunds && b.refunds.length > 0 && (
                  <RefundStatus refund={b.refunds[0]} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
