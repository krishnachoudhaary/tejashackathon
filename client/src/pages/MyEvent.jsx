import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BudgetCard } from '../components/BudgetCard';
import { RefundStatus } from '../components/RefundStatus';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const MyEvent = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('Date rescheduled');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [refundResult, setRefundResult] = useState(null);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user's events
      const eventsRes = await api.getUserEvents();
      if (eventsRes.success && eventsRes.data && eventsRes.data.events?.length > 0) {
        setEvents(eventsRes.data.events);
        setSelectedEvent(eventsRes.data.events[0]);
      }

      // 2. Fetch user's bookings
      const bookingsRes = await api.getBookings();
      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [isAuthenticated]);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelLoading(true);
    try {
      const res = await api.cancelBooking(cancelModalBooking.id, cancellationReason);
      if (res.success && res.data) {
        setRefundResult(res.data.refund);
        // Refresh bookings
        fetchEventData();
      } else {
        alert(res.message || 'Cancellation failed');
      }
    } catch (err) {
      alert('Network error during cancellation.');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>
          Loading Your Event Blueprint...
        </div>
      </div>
    );
  }

  // If user has no events yet, show quick create prompt
  if (!selectedEvent && events.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: '720px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Sparkles size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>No Event Plan Created Yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Get started by entering your celebration requirements and let our Smart Match engine generate a complete budget plan for you.
          </p>
          <Link to="/planner" className="btn btn-primary btn-lg">
            ✨ Plan My Event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Event Header Banner */}
      <div className="card" style={{ padding: '30px', marginBottom: '28px', borderLeft: '6px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-primary">{selectedEvent.event_type}</span>
              <span className="badge badge-success">Status: {selectedEvent.status}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              {selectedEvent.event_name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.92rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={15} color="#f59e0b" /> {selectedEvent.city}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={15} color="var(--primary)" /> {formatDate(selectedEvent.event_date)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={15} color="#0ea5e9" /> {selectedEvent.guest_count} Expected Guests
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/planner" className="btn btn-outline btn-sm">
              <Sparkles size={14} /> Plan Another Event
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Budget Tracker */}
      <BudgetCard
        totalBudget={selectedEvent.total_budget}
        allocatedBudget={selectedEvent.budget_status?.allocated_budget ?? selectedEvent.allocated_budget}
        remainingBudget={selectedEvent.budget_status?.remaining_budget ?? selectedEvent.remaining_budget}
        isWithinBudget={selectedEvent.budget_status?.is_within_budget ?? true}
        message={selectedEvent.budget_status?.message}
      />

      {/* Selected Vendors & Live Booking Status */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem' }}>Selected Service Vendors</h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {selectedEvent.selected_vendors?.length || 0} Categories Planned
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {selectedEvent.selected_vendors?.map((ev) => {
            const vendor = ev.vendor;
            // Check if there is an active booking for this vendor in this event
            const activeBooking = bookings.find(
              (b) => b.vendor_id === vendor?.id && b.booking_status !== 'CANCELLED'
            ) || bookings.find((b) => b.vendor_id === vendor?.id);

            const isConfirmed = activeBooking?.booking_status === 'CONFIRMED';
            const isCancelled = activeBooking?.booking_status === 'CANCELLED';

            return (
              <div
                key={ev.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isConfirmed ? '4px solid var(--success)' : isCancelled ? '4px solid var(--danger)' : '4px solid var(--primary)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-primary">{ev.category}</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>
                      {formatCurrency(ev.allocated_price)}
                    </strong>
                  </div>

                  {vendor ? (
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{vendor.business_name}</h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        {vendor.city} • Rating {vendor.rating} ★
                      </div>

                      {/* Live Booking & Payment Status Badge */}
                      <div style={{ marginBottom: '14px' }}>
                        {isConfirmed ? (
                          <div style={{ backgroundColor: 'var(--success-light)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#065f46' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}>
                              <CheckCircle2 size={15} color="#10b981" /> Advance Paid (Confirmed)
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{activeBooking.booking_reference}</span>
                          </div>
                        ) : isCancelled ? (
                          <div style={{ backgroundColor: 'var(--danger-light)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#991b1b', fontWeight: '600' }}>
                            Booking Cancelled • {activeBooking.payment_status}
                          </div>
                        ) : (
                          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Status: <strong>Ready to Book (20% Advance)</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No vendor selected for this category.</p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                  {isConfirmed ? (
                    <button
                      onClick={() => {
                        setCancelModalBooking(activeBooking);
                        setRefundResult(null);
                      }}
                      className="btn btn-outline btn-sm btn-block"
                      style={{ color: 'var(--danger)' }}
                    >
                      <RotateCcw size={14} /> Cancel Booking
                    </button>
                  ) : (
                    <Link
                      to={`/booking/summary?vendor_id=${vendor?.id}&event_id=${selectedEvent.id}&amount=${ev.allocated_price}&date=${selectedEvent.event_date}&category=${ev.category}`}
                      className="btn btn-primary btn-sm btn-block"
                    >
                      Pay 20% Advance ({formatCurrency(ev.allocated_price * 0.20)})
                    </Link>
                  )}

                  <Link to={`/vendors/${vendor?.id}`} className="btn btn-outline btn-sm">
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancellation & Refund Confirmation Modal */}
      {cancelModalBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '32px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)', marginBottom: '14px' }}>
              <AlertTriangle size={26} />
              <h3 style={{ fontSize: '1.35rem' }}>Cancel Booking & Review Refund</h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '18px' }}>
              Are you sure you want to cancel booking <strong>{cancelModalBooking.booking_reference}</strong> with <strong>{cancelModalBooking.vendor?.business_name}</strong>?
            </p>

            {/* Cancellation Policy Calculation Breakdown */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', padding: '16px', marginBottom: '20px', fontSize: '0.88rem' }}>
              <div style={{ fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>Transparent Refund Calculation:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>20% Advance Paid:</span>
                <strong>{formatCurrency(cancelModalBooking.advance_amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--danger)' }}>
                <span>Platform Cancellation Fee:</span>
                <span>-{formatCurrency(2000)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#166534', fontSize: '1rem' }}>
                <span>Refundable Amount:</span>
                <span>{formatCurrency(Math.max(0, cancelModalBooking.advance_amount - 2000))}</span>
              </div>
            </div>

            {refundResult ? (
              <div>
                <RefundStatus refund={refundResult} />
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '16px' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Reason for Cancellation</label>
                  <select
                    className="form-control"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                  >
                    <option value="Date rescheduled">Event date rescheduled</option>
                    <option value="Venue change">Found alternative preferred vendor</option>
                    <option value="Budget adjustment">Budget adjustments</option>
                    <option value="Family decision">Family / personal decision</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setCancelModalBooking(null)}
                    className="btn btn-outline btn-block"
                    disabled={cancelLoading}
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    disabled={cancelLoading}
                    className="btn btn-danger btn-block"
                  >
                    {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation & Refund'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
