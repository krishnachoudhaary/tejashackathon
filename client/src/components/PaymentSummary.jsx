import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { ShieldCheck, Info } from 'lucide-react';

export const PaymentSummary = ({ totalAmount, advanceAmount, remainingAmount, commissionAmount, advanceRate = 0.20 }) => {
  return (
    <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-color)' }}>
      <h4 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Payment & Advance Breakdown</span>
        <span className="badge badge-primary">20% Advance Model</span>
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Total Booking Value:</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: '700' }}>
          <span>Advance Payable Today ({(advanceRate * 100).toFixed(0)}%):</span>
          <span>{formatCurrency(advanceAmount)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Remaining Balance (Due on event day):</span>
          <span>{formatCurrency(remainingAmount)}</span>
        </div>

        {commissionAmount !== undefined && (
          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)' }}>
            <span>EventHub Platform Commission (10%):</span>
            <span>{formatCurrency(commissionAmount)}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: '14px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Simulated Hackathon Demo:</strong> No real bank transactions occur. An authentic demo transaction reference (<code>EH-DEMO-XXXXXX</code>) will be recorded.
        </span>
      </div>
    </div>
  );
};
