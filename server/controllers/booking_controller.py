from datetime import datetime
from flask import request
from config.db_config import SessionLocal, COMMISSION_RATE
from models.models import Booking, Vendor, Event, Payment
from services.payment_service import calculate_payment_breakdown
from services.refund_service import process_demo_cancellation_and_refund, calculate_cancellation_refund
from services.commission_service import calculate_commission
from utils.helpers import success_response, error_response, generate_booking_reference

def create_booking(current_user):
    data = request.get_json() or {}
    vendor_id = data.get('vendor_id')
    event_id = data.get('event_id')
    event_date_str = data.get('event_date')
    service_category = data.get('service_category', 'General Service')
    total_amount = float(data.get('total_amount', 0))
    special_notes = data.get('special_notes', '')

    if not vendor_id or not event_date_str or total_amount <= 0:
        return error_response("Vendor, valid event date, and total amount are required", 400)

    try:
        event_date = datetime.strptime(event_date_str, '%Y-%m-%d').date()
    except ValueError:
        return error_response("Invalid date format. Use YYYY-MM-DD", 400)

    db = SessionLocal()
    try:
        vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            return error_response("Vendor not found", 404)

        # Payment split: 20% advance, 80% remaining
        payment_split = calculate_payment_breakdown(total_amount)
        comm = calculate_commission(total_amount, COMMISSION_RATE)

        booking_ref = generate_booking_reference()

        new_booking = Booking(
            booking_reference=booking_ref,
            user_id=current_user.id,
            event_id=event_id,
            vendor_id=vendor_id,
            event_date=event_date,
            service_category=service_category or vendor.category,
            total_amount=total_amount,
            advance_amount=payment_split['advance_amount'],
            remaining_amount=payment_split['remaining_amount'],
            booking_status='PENDING',
            payment_status='PENDING',
            commission_rate=COMMISSION_RATE,
            commission_amount=comm['commission_amount'],
            special_notes=special_notes
        )
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        return success_response(new_booking.to_dict(), "Booking initiated successfully. Ready for advance payment.", 201)

    except Exception as e:
        db.rollback()
        return error_response(f"Booking creation failed: {str(e)}", 500)
    finally:
        db.close()

def get_bookings(current_user):
    db = SessionLocal()
    try:
        if current_user.role == 'VENDOR':
            # Find vendor profile for current user
            vendor = db.query(Vendor).filter(Vendor.user_id == current_user.id).first()
            if vendor:
                bookings = db.query(Booking).filter(Booking.vendor_id == vendor.id).order_by(Booking.created_at.desc()).all()
            else:
                bookings = []
        elif current_user.role == 'ADMIN':
            bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
        else:
            # CUSTOMER
            bookings = db.query(Booking).filter(Booking.user_id == current_user.id).order_by(Booking.created_at.desc()).all()

        return success_response({
            'count': len(bookings),
            'bookings': [b.to_dict() for b in bookings]
        }, "Bookings retrieved", 200)
    finally:
        db.close()

def get_booking_by_id(booking_id, current_user):
    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return error_response("Booking not found", 404)

        # Check authorization
        is_owner = (booking.user_id == current_user.id)
        is_vendor = (booking.vendor and booking.vendor.user_id == current_user.id)
        is_admin = (current_user.role == 'ADMIN')

        if not (is_owner or is_vendor or is_admin):
            return error_response("Unauthorized access to this booking", 403)

        booking_dict = booking.to_dict()
        booking_dict['cancellation_policy_preview'] = calculate_cancellation_refund(booking)
        return success_response(booking_dict, "Booking details retrieved", 200)
    finally:
        db.close()

def update_booking_status(booking_id, current_user):
    data = request.get_json() or {}
    new_status = data.get('booking_status')
    
    if not new_status:
        return error_response("New booking status is required", 400)

    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return error_response("Booking not found", 404)

        booking.booking_status = new_status
        db.commit()
        db.refresh(booking)
        return success_response(booking.to_dict(), f"Booking status updated to {new_status}", 200)
    except Exception as e:
        db.rollback()
        return error_response(f"Failed to update booking status: {str(e)}", 500)
    finally:
        db.close()

def cancel_booking(booking_id, current_user):
    data = request.get_json() or {}
    reason = data.get('reason', 'Customer requested cancellation')

    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return error_response("Booking not found", 404)

        is_owner = (booking.user_id == current_user.id)
        is_vendor = (booking.vendor and booking.vendor.user_id == current_user.id)
        is_admin = (current_user.role == 'ADMIN')

        if not (is_owner or is_vendor or is_admin):
            return error_response("Unauthorized to cancel this booking", 403)

        if booking.booking_status == 'CANCELLED':
            return error_response("This booking is already cancelled", 400)

        result = process_demo_cancellation_and_refund(db, booking, reason)
        return success_response(result, "Booking cancelled successfully. Simulated refund initiated.", 200)

    except Exception as e:
        db.rollback()
        return error_response(f"Cancellation failed: {str(e)}", 500)
    finally:
        db.close()
