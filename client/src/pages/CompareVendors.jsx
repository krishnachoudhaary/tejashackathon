import React from 'react';
import { useCompare } from '../context/CompareContext';
import { CompareTable } from '../components/CompareTable';
import { Scale, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CompareVendors = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scale size={28} color="var(--primary)" />
            Side-by-Side Vendor Comparison
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Compare factual capacity, rooms, starting rates, and amenities across your shortlisted vendors.
          </p>
        </div>

        {compareList.length > 0 && (
          <button onClick={clearCompare} className="btn btn-outline btn-sm" style={{ color: 'var(--danger)' }}>
            <Trash2 size={14} /> Clear All ({compareList.length})
          </button>
        )}
      </div>

      <CompareTable
        vendors={compareList}
        onRemove={removeFromCompare}
        onSelectVendor={(v) => navigate(`/booking/summary?vendor_id=${v.id}&amount=${v.starting_price}`)}
      />
    </div>
  );
};
