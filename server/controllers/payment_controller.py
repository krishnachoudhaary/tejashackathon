from flask import request
from config.db_config import SessionLocal
from models.models import Booking, Payment
from services.payment_service import process_demo_payment
from utils.helpers import success_response, error_response

def handle_demo_payment(current_user):
    data = request.get_json() or {}
    booking_id = data.get('booking_id')
    payment_type = data.get('payment_type', 'ADVANCE')
    payment_method = data.get('payment_method', 'UPI (Simulated)')

    if not booking_id:
        return error_response("Booking ID is required", 400)

    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return error_response("Booking not found", 404)

        if booking.user_id != current_user.id and current_user.role != 'ADMIN':
            return error_response("Unauthorized", 403)

        if booking.booking_status == 'CANCELLED':
            return error_response("Cannot process payment for a cancelled booking", 400)

        result = process_demo_payment(
            db=db,
            booking=booking,
            payment_type=payment_type,
            payment_method=payment_method
        )
        return success_response(result, "Simulated payment successful! Reference generated.", 200)

    except Exception as e:
        db.rollback()
        return error_response(f"Payment processing failed: {str(e)}", 500)
    finally:
        db.close()

def get_payments_for_booking(booking_id, current_user):
    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return error_response("Booking not found", 404)

        payments = db.query(Payment).filter(Payment.booking_id == booking_id).order_by(Payment.payment_date.desc()).all()
        return success_response({
            'booking_reference': booking.booking_reference,
            'total_amount': float(booking.total_amount),
            'advance_amount': float(booking.advance_amount),
            'payment_status': booking.payment_status,
            'payments': [p.to_dict() for p in payments]
        }, "Payment records retrieved", 200)
    finally:
        db.close()
