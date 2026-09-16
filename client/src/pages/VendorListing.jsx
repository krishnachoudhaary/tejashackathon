import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { VendorCard } from '../components/VendorCard';
import { FilterPanel } from '../components/FilterPanel';
import { Search, MapPin, Tag } from 'lucide-react';

export const VendorListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State initialized from URL query params
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    min_rating: searchParams.get('min_rating') || '',
    max_price: searchParams.get('max_price') || 150000,
    sort_by: searchParams.get('sort_by') || 'rating_desc'
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.getVendors(filters);
      if (res.success && res.data) {
        setVendors(res.data.vendors || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      city: '',
      category: '',
      search: '',
      min_rating: '',
      max_price: 150000,
      sort_by: 'rating_desc'
    });
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Explore Local Event Vendors</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Discover verified venues, caterers, decorators, photographers, and DJs across Bihar's Tier-2 & Tier-3 cities.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Showing <strong>{vendors.length}</strong> verified vendor{vendors.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Vendor Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="animate-pulse" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>
            Loading Verified Vendors...
          </div>
        </div>
      ) : vendors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ marginBottom: '8px' }}>No matching vendors found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Try adjusting your search criteria or resetting filters to see more results.
          </p>
          <button onClick={handleReset} className="btn btn-primary btn-sm">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      )}
    </div>
  );
};
