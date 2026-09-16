import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RefundStatus = ({ refund }) => {
  if (!refund) return null;

  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '18px',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: '700', fontSize: '1rem' }}>
          <RotateCcw size={18} />
          <span>Simulated Refund Initiated</span>
        </div>
        <span className="badge badge-warning">{refund.refund_status}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '0.85rem', marginBottom: '12px' }}>
        <div>
          <span style={{ color: '#7f1d1d', display: 'block', fontSize: '0.75rem' }}>Advance Paid:</span>
          <strong>{formatCurrency(refund.total_paid)}</strong>
        </div>
        <div>
          <span style={{ color: '#7f1d1d', display: 'block', fontSize: '0.75rem' }}>Platform Fee:</span>
          <strong>{formatCurrency(refund.platform_cancellation_fee)}</strong>
        </div>
        <div>
          <span style={{ color: '#7f1d1d', display: 'block', fontSize: '0.75rem' }}>Refund Amount:</span>
          <strong style={{ color: '#166534', fontSize: '1rem' }}>{formatCurrency(refund.refundable_amount)}</strong>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#7f1d1d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Refund Reference:</span>
        <code style={{ fontWeight: '700', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>
          {refund.refund_reference}
        </code>
      </div>
    </div>
  );
};
