import React from 'react';
import { Star, CheckCircle, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ReviewCard = ({ review }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
            {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {review.user_name || 'Verified Host'}
              <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                <CheckCircle size={10} /> Verified Booking
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < review.rating ? '#f59e0b' : 'none'}
              color={i < review.rating ? '#f59e0b' : '#cbd5e1'}
            />
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        "{review.comment}"
      </p>

      {review.created_at && (
        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} /> {formatDate(review.created_at)}
        </div>
      )}
    </div>
  );
};
