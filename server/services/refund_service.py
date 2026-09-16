from config.db_config import PLATFORM_CANCELLATION_FEE
from utils.helpers import generate_refund_reference
from models.models import Refund, Payment, Booking

def calculate_cancellation_refund(booking, platform_fee=None):
    """
    Calculates transparent refund based on total amount paid minus platform/cancellation fee.
    """
    fee = platform_fee if platform_fee is not None else PLATFORM_CANCELLATION_FEE
    total_paid = float(booking.advance_amount) if booking.payment_status in ['PAID', 'PARTIALLY_PAID'] else 0.0
    
    # If booking hasn't been paid, fee is 0 and refund is 0
    if total_paid == 0:
        return {
            'total_paid': 0.0,
            'platform_cancellation_fee': 0.0,
            'refundable_amount': 0.0,
            'policy_note': 'No payments recorded for this booking. Cancellation is immediate with ₹0 charge.'
        }
    
    # Applied fee cannot exceed total paid
    actual_fee = min(total_paid, fee)
    refundable = max(0.0, total_paid - actual_fee)
    
    return {
        'total_paid': round(total_paid, 2),
        'platform_cancellation_fee': round(actual_fee, 2),
        'refundable_amount': round(refundable, 2),
        'policy_note': f"Transparent policy: Advance paid ₹{total_paid:,.2f} - Standard platform cancellation fee ₹{actual_fee:,.2f} = Refund of ₹{refundable:,.2f}."
    }

def process_demo_cancellation_and_refund(db, booking, reason="Customer requested cancellation"):
    """
    Cancels booking and initiates simulated refund (EH-REFUND-XXXXXX).
    """
    refund_calc = calculate_cancellation_refund(booking)
    refund_ref = generate_refund_reference()
    
    # Find latest successful payment if any
    latest_payment = db.query(Payment).filter(
        Payment.booking_id == booking.id,
        Payment.payment_status == 'PAID'
    ).order_by(Payment.id.desc()).first()
    
    refund_record = None
    if refund_calc['total_paid'] > 0:
        refund_record = Refund(
            booking_id=booking.id,
            payment_id=latest_payment.id if latest_payment else None,
            total_paid=refund_calc['total_paid'],
            platform_cancellation_fee=refund_calc['platform_cancellation_fee'],
            refundable_amount=refund_calc['refundable_amount'],
            refund_status='REFUND_INITIATED',
            refund_reference=refund_ref,
            reason=reason
        )
        db.add(refund_record)
        booking.payment_status = 'REFUND_INITIATED'
    else:
        booking.payment_status = 'CANCELLED'
        
    booking.booking_status = 'CANCELLED'
    db.commit()
    
    if refund_record:
        db.refresh(refund_record)
    db.refresh(booking)
    
    return {
        'booking': booking.to_dict(),
        'refund': refund_record.to_dict() if refund_record else None,
        'refund_reference': refund_ref if refund_record else None,
        'message': 'Booking cancelled successfully. Simulated refund initiated.'
    }
