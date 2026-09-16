from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Numeric, Boolean, Date, DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from config.db_config import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(String(20), nullable=False, default='CUSTOMER') # CUSTOMER, VENDOR, ADMIN
    city = Column(String(100), default='Patna')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    vendor_profile = relationship('Vendor', back_populates='user', uselist=False)
    events = relationship('Event', back_populates='user', cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='user', cascade='all, delete-orphan')
    reviews = relationship('Review', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'city': self.city,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Vendor(Base):
    __tablename__ = 'vendors'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    business_name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False) # Venue, Catering, Decoration, Photography, DJ, Makeup, Event Services
    city = Column(String(100), nullable=False)
    address = Column(Text)
    description = Column(Text)
    starting_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    price_unit = Column(String(50), default='per event')
    rating = Column(Numeric(2, 1), default=4.5)
    review_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=True)
    image_url = Column(Text)
    contact_phone = Column(String(20))
    contact_email = Column(String(150))
    supported_event_types = Column(String(255), default='Wedding,Birthday,Engagement,Corporate,Anniversary')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship('User', back_populates='vendor_profile')
    venue_details = relationship('Venue', back_populates='vendor', uselist=False, cascade='all, delete-orphan')
    services = relationship('VendorService', back_populates='vendor', cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='vendor', cascade='all, delete-orphan')
    reviews = relationship('Review', back_populates='vendor', cascade='all, delete-orphan')

    def to_dict(self, include_details=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'business_name': self.business_name,
            'category': self.category,
            'city': self.city,
            'address': self.address,
            'description': self.description,
            'starting_price': float(self.starting_price) if self.starting_price is not None else 0.0,
            'price_unit': self.price_unit,
            'rating': float(self.rating) if self.rating is not None else 4.5,
            'review_count': self.review_count or 0,
            'is_verified': bool(self.is_verified),
            'image_url': self.image_url,
            'contact_phone': self.contact_phone,
            'contact_email': self.contact_email,
            'supported_event_types': self.supported_event_types.split(',') if self.supported_event_types else []
        }
        if include_details:
            if self.venue_details:
                data['venue_details'] = self.venue_details.to_dict()
            if self.services:
                data['services'] = [s.to_dict() for s in self.services]
            if self.reviews:
                data['reviews'] = [r.to_dict() for r in self.reviews]
        return data


class Venue(Base):
    __tablename__ = 'venues'

    id = Column(Integer, primary_key=True, autoincrement=True)
    vendor_id = Column(Integer, ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False, unique=True)
    max_capacity = Column(Integer, nullable=False, default=300)
    main_hall_capacity = Column(Integer, nullable=False, default=200)
    conference_hall_capacity = Column(Integer, default=100)
    rooms_available = Column(Integer, nullable=False, default=8)
    lawn_available = Column(Boolean, default=True)
    parking_capacity = Column(Integer, default=50)
    catering_policy = Column(String(50), default='Both') # In-House Only, Outside Allowed, Both
    ac_available = Column(Boolean, default=True)
    facilities = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship('Vendor', back_populates='venue_details')

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'max_capacity': self.max_capacity,
            'main_hall_capacity': self.main_hall_capacity,
            'conference_hall_capacity': self.conference_hall_capacity,
            'rooms_available': self.rooms_available,
            'lawn_available': bool(self.lawn_available),
            'parking_capacity': self.parking_capacity,
            'catering_policy': self.catering_policy,
            'ac_available': bool(self.ac_available),
            'facilities': self.facilities
        }


class VendorService(Base):
    __tablename__ = 'vendor_services'

    id = Column(Integer, primary_key=True, autoincrement=True)
    vendor_id = Column(Integer, ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False)
    service_name = Column(String(150), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    price_type = Column(String(50), default='fixed')
    is_popular = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship('Vendor', back_populates='services')

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'service_name': self.service_name,
            'description': self.description,
            'price': float(self.price) if self.price is not None else 0.0,
            'price_type': self.price_type,
            'is_popular': bool(self.is_popular)
        }


class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    event_name = Column(String(150), nullable=False)
    event_type = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False)
    event_date = Column(Date, nullable=False)
    guest_count = Column(Integer, nullable=False, default=100)
    total_budget = Column(Numeric(12, 2), nullable=False)
    allocated_budget = Column(Numeric(12, 2), default=0.00)
    remaining_budget = Column(Numeric(12, 2), default=0.00)
    required_services = Column(Text) # Comma-separated or JSON list
    status = Column(String(50), default='PLANNING') # PLANNING, BOOKED, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='events')
    event_vendors = relationship('EventVendor', back_populates='event', cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='event')

    def to_dict(self, include_vendors=True):
        services_list = [s.strip() for s in self.required_services.split(',') if s.strip()] if self.required_services else []
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'event_name': self.event_name,
            'event_type': self.event_type,
            'city': self.city,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'guest_count': self.guest_count,
            'total_budget': float(self.total_budget) if self.total_budget is not None else 0.0,
            'allocated_budget': float(self.allocated_budget) if self.allocated_budget is not None else 0.0,
            'remaining_budget': float(self.remaining_budget) if self.remaining_budget is not None else 0.0,
            'required_services': services_list,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_vendors:
            data['selected_vendors'] = [ev.to_dict() for ev in self.event_vendors]
        return data


class EventVendor(Base):
    __tablename__ = 'event_vendors'

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey('events.id', ondelete='CASCADE'), nullable=False)
    vendor_id = Column(Integer, ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False)
    category = Column(String(50), nullable=False)
    allocated_price = Column(Numeric(10, 2), nullable=False)
    is_booked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    event = relationship('Event', back_populates='event_vendors')
    vendor = relationship('Vendor')

    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'vendor_id': self.vendor_id,
            'category': self.category,
            'allocated_price': float(self.allocated_price) if self.allocated_price is not None else 0.0,
            'is_booked': bool(self.is_booked),
            'vendor': self.vendor.to_dict(include_details=True) if self.vendor else None
        }


class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_reference = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    event_id = Column(Integer, ForeignKey('events.id', ondelete='SET NULL'), nullable=True)
    vendor_id = Column(Integer, ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False)
    event_date = Column(Date, nullable=False)
    service_category = Column(String(50), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    advance_amount = Column(Numeric(10, 2), nullable=False)
    remaining_amount = Column(Numeric(10, 2), nullable=False)
    booking_status = Column(String(50), default='PENDING') # PENDING, CONFIRMED, CANCELLED, COMPLETED
    payment_status = Column(String(50), default='PENDING') # PENDING, PARTIALLY_PAID, PAID, REFUND_INITIATED, REFUNDED
    commission_rate = Column(Numeric(4, 2), default=0.10)
    commission_amount = Column(Numeric(10, 2), default=0.00)
    special_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='bookings')
    event = relationship('Event', back_populates='bookings')
    vendor = relationship('Vendor', back_populates='bookings')
    payments = relationship('Payment', back_populates='booking', cascade='all, delete-orphan')
    refunds = relationship('Refund', back_populates='booking', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'booking_reference': self.booking_reference,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'vendor_id': self.vendor_id,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'service_category': self.service_category,
            'total_amount': float(self.total_amount) if self.total_amount is not None else 0.0,
            'advance_amount': float(self.advance_amount) if self.advance_amount is not None else 0.0,
            'remaining_amount': float(self.remaining_amount) if self.remaining_amount is not None else 0.0,
            'booking_status': self.booking_status,
            'payment_status': self.payment_status,
            'commission_rate': float(self.commission_rate) if self.commission_rate is not None else 0.10,
            'commission_amount': float(self.commission_amount) if self.commission_amount is not None else 0.0,
            'special_notes': self.special_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'vendor': self.vendor.to_dict(include_details=True) if self.vendor else None,
            'user_name': self.user.name if self.user else None,
            'user_email': self.user.email if self.user else None,
            'user_phone': self.user.phone if self.user else None,
            'payments': [p.to_dict() for p in self.payments],
            'refunds': [r.to_dict() for r in self.refunds]
        }


class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_type = Column(String(50), default='ADVANCE') # ADVANCE, REMAINING, FULL
    payment_status = Column(String(50), default='PAID') # PENDING, PAID, FAILED, REFUNDED
    payment_method = Column(String(50), default='UPI (Simulated)')
    transaction_reference = Column(String(100), unique=True, nullable=False)
    payment_date = Column(DateTime, default=datetime.utcnow)

    booking = relationship('Booking', back_populates='payments')

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'amount': float(self.amount) if self.amount is not None else 0.0,
            'payment_type': self.payment_type,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'transaction_reference': self.transaction_reference,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None
        }


class Refund(Base):
    __tablename__ = 'refunds'

    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False)
    payment_id = Column(Integer, ForeignKey('payments.id', ondelete='SET NULL'), nullable=True)
    total_paid = Column(Numeric(10, 2), nullable=False)
    platform_cancellation_fee = Column(Numeric(10, 2), nullable=False, default=0.00)
    refundable_amount = Column(Numeric(10, 2), nullable=False)
    refund_status = Column(String(50), default='REFUND_INITIATED') # REFUND_INITIATED, PROCESSING, REFUNDED
    refund_reference = Column(String(100), unique=True, nullable=False)
    reason = Column(Text)
    refund_date = Column(DateTime, default=datetime.utcnow)

    booking = relationship('Booking', back_populates='refunds')

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'payment_id': self.payment_id,
            'total_paid': float(self.total_paid) if self.total_paid is not None else 0.0,
            'platform_cancellation_fee': float(self.platform_cancellation_fee) if self.platform_cancellation_fee is not None else 0.0,
            'refundable_amount': float(self.refundable_amount) if self.refundable_amount is not None else 0.0,
            'refund_status': self.refund_status,
            'refund_reference': self.refund_reference,
            'reason': self.reason,
            'refund_date': self.refund_date.isoformat() if self.refund_date else None
        }


class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, autoincrement=True)
    vendor_id = Column(Integer, ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='SET NULL'), nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship('Vendor', back_populates='reviews')
    user = relationship('User', back_populates='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else 'Verified Customer',
            'booking_id': self.booking_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
