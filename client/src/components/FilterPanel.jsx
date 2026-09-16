import React from 'react';
import { Search, RotateCcw, Filter, MapPin, Tag, Star, Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const CITIES = ['All', 'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Begusarai', 'Nalanda', 'Sheikhpura'];
const CATEGORIES = ['All', 'Venue', 'Catering', 'Decoration', 'Photography', 'DJ', 'Makeup'];

export const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '1.05rem' }}>
          <Filter size={18} color="var(--primary)" />
          <span>Filters & Search</span>
        </div>
        <button
          onClick={onReset}
          className="btn btn-outline btn-sm"
          style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Search Keyword */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Search size={14} /> Search
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search name, description..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* City Filter */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="#f59e0b" /> City / Region
          </label>
          <select
            className="form-control"
            value={filters.city || 'All'}
            onChange={(e) => onFilterChange('city', e.target.value)}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Cities (Bihar)' : c}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag size={14} color="var(--primary)" /> Category
          </label>
          <select
            className="form-control"
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {/* Min Rating */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} color="#f59e0b" /> Min Rating
          </label>
          <select
            className="form-control"
            value={filters.min_rating || ''}
            onChange={(e) => onFilterChange('min_rating', e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars ★★★★★</option>
            <option value="4.0">4.0+ Stars ★★★★☆</option>
            <option value="3.5">3.5+ Stars ★★★☆☆</option>
          </select>
        </div>

        {/* Max Budget Range */}
        <div>
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Max Price</span>
            <strong style={{ color: 'var(--primary)' }}>{filters.max_price ? formatCurrency(filters.max_price) : 'Any'}</strong>
          </label>
          <input
            type="range"
            min="10000"
            max="150000"
            step="5000"
            value={filters.max_price || 150000}
            onChange={(e) => onFilterChange('max_price', Number(e.target.value))}
            style={{ width: '100%', marginTop: '6px' }}
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="form-label">Sort By</label>
          <select
            className="form-control"
            value={filters.sort_by || 'rating_desc'}
            onChange={(e) => onFilterChange('sort_by', e.target.value)}
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};
