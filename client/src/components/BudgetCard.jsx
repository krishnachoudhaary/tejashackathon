import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Wallet, AlertTriangle, CheckCircle } from 'lucide-react';

export const BudgetCard = ({ totalBudget, allocatedBudget, remainingBudget, isWithinBudget, message }) => {
  const isOver = remainingBudget < 0;
  const percentageUsed = totalBudget > 0 ? Math.min(100, Math.round((allocatedBudget / totalBudget) * 100)) : 0;

  return (
    <div className="card" style={{ borderLeft: `6px solid ${isOver ? 'var(--danger)' : 'var(--success)'}`, marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: isOver ? 'var(--danger-light)' : 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOver ? 'var(--danger)' : 'var(--success)' }}>
            <Wallet size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Event Budget Tracker</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Real-time automatic recalculation</div>
          </div>
        </div>

        <div className={`badge ${isOver ? 'badge-danger' : 'badge-success'}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          {isOver ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
          {isOver ? `Over Budget by ${formatCurrency(Math.abs(remainingBudget))}` : 'Within Budget'}
        </div>
      </div>

      {/* 3 Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '18px' }}>
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Budget</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {formatCurrency(totalBudget)}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Allocated Plan</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            {formatCurrency(allocatedBudget)}
          </div>
        </div>

        <div style={{ backgroundColor: isOver ? 'var(--danger-light)' : 'var(--success-light)', padding: '14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: isOver ? 'var(--danger)' : '#065f46', fontWeight: '600', textTransform: 'uppercase' }}>
            {isOver ? 'Deficit' : 'Remaining Budget'}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: isOver ? 'var(--danger)' : 'var(--success)', marginTop: '4px' }}>
            {formatCurrency(remainingBudget)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px', fontWeight: '600', color: 'var(--text-muted)' }}>
          <span>Budget Utilized</span>
          <span>{percentageUsed}%</span>
        </div>
        <div style={{ height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${percentageUsed}%`,
            backgroundColor: isOver ? 'var(--danger)' : percentageUsed > 85 ? 'var(--accent)' : 'var(--primary)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {message && (
        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: isOver ? 'var(--danger)' : 'var(--text-muted)', fontWeight: '500' }}>
          {message}
        </div>
      )}
    </div>
  );
};
