import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, XCircle, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const CompareTable = ({ vendors, onRemove, onSelectVendor }) => {
  if (!vendors || vendors.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h3 style={{ marginBottom: '10px' }}>No Vendors Selected for Comparison</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Explore vendors and click "Compare" on up to 3 vendors to view a side-by-side factual comparison.
        </p>
        <Link to="/vendors" className="btn btn-primary">
          Explore Vendors
        </Link>
      </div>
    );
  }

  const features = [
    { label: 'Category', render: (v) => <span className="badge badge-primary">{v.category}</span> },
    { label: 'City', render: (v) => <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="#f59e0b" /> {v.city}</span> },
    {
      label: 'Starting Price',
      render: (v) => (
        <div>
          <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>{formatCurrency(v.starting_price)}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>/{v.price_unit || 'event'}</span>
        </div>
      )
    },
    {
      label: 'Rating & Reviews',
      render: (v) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
          <Star size={15} fill="#f59e0b" color="#f59e0b" /> {v.rating} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({v.review_count} reviews)</span>
        </span>
      )
    },
    {
      label: 'Max Guest Capacity',
      render: (v) => v.max_capacity && v.max_capacity !== 'N/A' ? <strong>{v.max_capacity} Guests</strong> : <span style={{ color: 'var(--text-light)' }}>N/A (Non-venue)</span>
    },
    {
      label: 'Main Banquet Hall',
      render: (v) => v.main_hall_capacity && v.main_hall_capacity !== 'N/A' ? `${v.main_hall_capacity} Guests` : <span style={{ color: 'var(--text-light)' }}>-</span>
    },
    {
      label: 'Guest Rooms Available',
      render: (v) => v.rooms_available && v.rooms_available !== 'N/A' ? `${v.rooms_available} Rooms` : <span style={{ color: 'var(--text-light)' }}>-</span>
    },
    {
      label: 'Lawn Area Available',
      render: (v) => v.lawn_available === true ? <span style={{ color: '#065f46', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={15} color="#10b981" /> Yes</span> : <span style={{ color: 'var(--text-light)' }}>No</span>
    },
    {
      label: 'Catering Policy',
      render: (v) => v.catering_policy || 'Standard Service'
    },
    {
      label: 'Key Facilities / Features',
      render: (v) => <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{v.facilities || 'Professional equipment & staff'}</span>
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-color)' }}>
            <th style={{ padding: '18px', textAlign: 'left', minWidth: '180px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Comparison Metrics
            </th>
            {vendors.map((v) => (
              <th key={v.id} style={{ padding: '18px', textAlign: 'left', minWidth: '240px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{v.business_name}</h4>
                  <button
                    onClick={() => onRemove(v.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                    title="Remove from comparison"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <Link to={`/vendors/${v.id}`} className="btn btn-outline btn-sm" style={{ width: '100%', marginBottom: '8px' }}>
                  View Full Profile
                </Link>
                {onSelectVendor && (
                  <button
                    onClick={() => onSelectVendor(v)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    Select This Vendor
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feat, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fcfdfe' }}>
              <td style={{ padding: '14px 18px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-main)', borderRight: '1px solid var(--border-color)' }}>
                {feat.label}
              </td>
              {vendors.map((v) => (
                <td key={v.id} style={{ padding: '14px 18px', fontSize: '0.88rem', borderRight: '1px solid var(--border-color)' }}>
                  {feat.render(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
