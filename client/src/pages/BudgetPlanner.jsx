import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { BudgetCard } from '../components/BudgetCard';
import { Wallet, PieChart, Plus, Trash2, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export const BudgetPlanner = () => {
  const [totalBudget, setTotalBudget] = useState(300000);
  const [eventType, setEventType] = useState('Wedding');
  const [items, setItems] = useState([
    { id: 1, category: 'Venue', name: 'Patliputra Grand Palace & Banquet', price: 70000 },
    { id: 2, category: 'Catering', name: 'Rasoi Ghar Gourmet Caterers (250 Pax)', price: 90000 },
    { id: 3, category: 'Decoration', name: 'Vaishali Royal Floral Mandap', price: 40000 },
    { id: 4, category: 'Photography', name: 'Drishti 4K Wedding Cinema', price: 35000 },
    { id: 5, category: 'DJ', name: 'BeatDrop Sound & Moving Heads', price: 25000 }
  ]);

  const [recommendedSplit, setRecommendedSplit] = useState({});
  const [newItemCategory, setNewItemCategory] = useState('Other');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Calculate allocations dynamically
  useEffect(() => {
    const fetchSplit = async () => {
      const res = await api.calculateBudget({
        total_budget: totalBudget,
        event_type: eventType,
        required_services: ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'],
        selected_items: items
      });
      if (res.success && res.data) {
        setRecommendedSplit(res.data.recommended_split || {});
      }
    };
    fetchSplit();
  }, [totalBudget, eventType]);

  const allocatedTotal = items.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  const remainingTotal = totalBudget - allocatedTotal;
  const isWithin = remainingTotal >= 0;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const item = {
      id: Date.now(),
      category: newItemCategory,
      name: newItemName,
      price: Number(newItemPrice)
    };
    setItems([...items, item]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Dynamic Financial Control</span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>Interactive Budget Planner</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage event costs dynamically. Change budget limits, adjust vendor items, and monitor remaining funds in real-time.
        </p>
      </div>

      {/* Top Budget Parameters */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'center' }}>
          <div>
            <label className="form-label">Total Planned Event Budget</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                className="form-control"
                value={totalBudget}
                step="10000"
                min="50000"
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Celebration Type</label>
            <select
              className="form-control"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="Wedding">Wedding (Traditional/Royal)</option>
              <option value="Birthday">Birthday Celebration</option>
              <option value="Engagement">Engagement & Ring Ceremony</option>
              <option value="Corporate">Corporate / Conference</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Summary Metric Card */}
      <BudgetCard
        totalBudget={totalBudget}
        allocatedBudget={allocatedTotal}
        remainingBudget={remainingTotal}
        isWithinBudget={isWithin}
        message={isWithin ? `Great! You have ${formatCurrency(remainingTotal)} left for contingency.` : `Your current plan exceeds budget by ${formatCurrency(Math.abs(remainingTotal))}.`}
      />

      {/* 2-Column Split: Selected Items vs Recommended Benchmark */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '40px' }}>
        {/* Selected Vendor Costs Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={18} color="var(--primary)" />
              Selected Service Allocations
            </h3>
            <span className="badge badge-neutral">{items.length} Items</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>{item.category}</span>
                  <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>{item.name}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{formatCurrency(item.price)}</strong>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Item Form */}
          <form onSubmit={handleAddItem} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Add Custom Expense / Vendor</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px' }}>
              <select
                className="form-control"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Decoration">Decoration</option>
                <option value="Photography">Photography</option>
                <option value="DJ">DJ</option>
                <option value="Transportation">Transport</option>
                <option value="Gifts">Gifts / Misc</option>
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Item / Vendor name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                style={{ padding: '8px' }}
              />

              <input
                type="number"
                className="form-control"
                placeholder="₹ Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                style={{ padding: '8px' }}
              />

              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 14px' }}>
                <Plus size={16} /> Add
              </button>
            </div>
          </form>
        </div>

        {/* Recommended Category Distribution Benchmark */}
        <div className="card">
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="var(--accent)" />
              Target Benchmark Distribution
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Standard Tier-2/3 budget allocation guidelines for {eventType}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(recommendedSplit).map(([cat, amount]) => {
              const currentCatSpent = items.filter((i) => i.category === cat).reduce((acc, curr) => acc + Number(curr.price), 0);
              const isOverCat = currentCatSpent > amount;

              return (
                <div key={cat} style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <strong>{cat}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Spent: <strong style={{ color: isOverCat ? 'var(--danger)' : 'var(--primary)' }}>{formatCurrency(currentCatSpent)}</strong> / Target {formatCurrency(amount)}
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, Math.round((currentCatSpent / (amount || 1)) * 100))}%`,
                      backgroundColor: isOverCat ? 'var(--danger)' : 'var(--primary)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
