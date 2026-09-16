import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Scale, Users, Home, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useCompare } from '../context/CompareContext';
import { MatchScore } from './MatchScore';

export const VendorCard = ({ vendor, smartMatchInfo, onSelectVendor, isSelected, showSelectButton = false }) => {
  const { toggleCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(vendor.id);
  const venue = vendor.venue_details;

  // Category Icon & Accent Colors
  const categoryGradients = {
    Venue: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    Catering: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    Decoration: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    Photography: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    DJ: 'linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)',
    Makeup: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
  };

  const gradient = categoryGradients[vendor.category] || 'linear-gradient(135deg, #64748b 0%, #475569 100%)';

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
      backgroundColor: isSelected ? '#faf5ff' : '#ffffff',
      height: '100%',
      position: 'relative'
    }}>
      {/* Top Banner with Category and Verification */}
      <div>
        <div style={{
          height: '110px',
          borderRadius: '12px',
          background: gradient,
          color: '#ffffff',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Decorative Circle */}
          <div style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.12)'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '700',
              backdropFilter: 'blur(4px)'
            }}>
              {vendor.category}
            </span>

            {vendor.is_verified && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#065f46',
                padding: '3px 8px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: '700'
              }}>
                <CheckCircle size={13} color="#10b981" /> Verified
              </span>
            )}
          </div>

          <div style={{ zIndex: 1 }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Starting From</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800' }}>
              {formatCurrency(vendor.starting_price)}
              <span style={{ fontSize: '0.75rem', fontWeight: '500', opacity: 0.85, marginLeft: '4px' }}>
                /{vendor.price_unit || 'event'}
              </span>
            </div>
          </div>
        </div>

        {/* Smart Match score if present */}
        {smartMatchInfo && (
          <MatchScore
            score={smartMatchInfo.match_score}
            reasons={smartMatchInfo.reasons}
            compact={false}
          />
        )}

        {/* Vendor Info */}
        <div style={{ marginBottom: '14px' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-main)' }}>
            {vendor.business_name}
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="#f59e0b" /> {vendor.city}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: '#b45309' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" /> {vendor.rating}
              <span style={{ color: 'var(--text-light)', fontWeight: '400' }}>({vendor.review_count})</span>
            </span>
          </div>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {vendor.description}
          </p>
        </div>

        {/* Specific venue features badge if Venue */}
        {venue && (
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '10px 12px',
            borderRadius: '8px',
            marginBottom: '14px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={14} color="var(--primary)" /> <strong>{venue.max_capacity}</strong> Guests
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Home size={14} color="var(--primary)" /> <strong>{venue.rooms_available}</strong> Rooms
            </span>
            {venue.lawn_available && (
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Lawn</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/vendors/${vendor.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
            View Details
          </Link>
          <button
            onClick={() => toggleCompare(vendor)}
            className={`btn btn-sm ${inCompare ? 'btn-accent' : 'btn-outline'}`}
            style={{ padding: '6px 10px' }}
            title={inCompare ? 'Remove from comparison' : 'Add to compare'}
          >
            <Scale size={15} />
            <span>{inCompare ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>

        {showSelectButton && onSelectVendor && (
          <button
            onClick={() => onSelectVendor(vendor)}
            className={`btn btn-sm ${isSelected ? 'btn-secondary' : 'btn-primary'}`}
            style={{ width: '100%' }}
          >
            {isSelected ? '✓ Selected in Plan' : 'Select This Vendor'}
          </button>
        )}
      </div>
    </div>
  );
};
