import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { getMatchScoreBadge } from '../utils/formatters';

export const MatchScore = ({ score = 85, reasons = [], compact = false }) => {
  const badgeStyle = getMatchScoreBadge(score);

  if (compact) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: badgeStyle.bg,
        color: badgeStyle.text,
        border: `1px solid ${badgeStyle.border}`,
        padding: '3px 8px',
        borderRadius: '8px',
        fontWeight: '700',
        fontSize: '0.8rem'
      }}>
        <Sparkles size={13} />
        {score}% Match
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: badgeStyle.bg,
      border: `1px solid ${badgeStyle.border}`,
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: badgeStyle.text, fontWeight: '700', fontSize: '0.95rem' }}>
          <Sparkles size={18} />
          <span>Smart Match Score: {score}%</span>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: badgeStyle.text, backgroundColor: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: '6px' }}>
          {badgeStyle.label}
        </span>
      </div>

      {reasons && reasons.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
          {reasons.slice(0, 3).map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: badgeStyle.text }}>
              <Check size={14} style={{ flexShrink: 0 }} />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
