from config.db_config import ADVANCE_PAYMENT_RATE
from utils.helpers import generate_demo_transaction_ref
from services.commission_service import calculate_commission
from models.models import Payment, Booking

def calculate_payment_breakdown(total_amount, advance_rate=None):
    """
    Computes advance requirement (20%) and remaining balance (80%).
    """
    rate = advance_rate if advance_rate is not None else ADVANCE_PAYMENT_RATE
    advance_amount = round(total_amount * rate, 2)
    remaining_amount = round(total_amount - advance_amount, 2)
    
    return {
        'total_amount': round(total_amount, 2),
        'advance_rate': rate,
        'advance_amount': advance_amount,
        'remaining_amount': remaining_amount
    }

def process_demo_payment(db, booking, payment_type='ADVANCE', payment_method='UPI (Simulated)'):
    """
    Executes simulated advance payment for hackathon demo.
    Generates EH-DEMO-XXXXXX reference, records payment in DB, and confirms booking.
    """
    if payment_type == 'ADVANCE':
        amount_to_pay = float(booking.advance_amount)
    elif payment_type == 'REMAINING':
        amount_to_pay = float(booking.remaining_amount)
    else:
        amount_to_pay = float(booking.total_amount)
        
    txn_ref = generate_demo_transaction_ref()
    
    payment = Payment(
        booking_id=booking.id,
        amount=amount_to_pay,
        payment_type=payment_type,
        payment_status='PAID',
        payment_method=payment_method,
        transaction_reference=txn_ref
    )
    db.add(payment)
    
    # Update Booking Status
    booking.booking_status = 'CONFIRMED'
    booking.payment_status = 'PAID' if payment_type in ['FULL', 'ADVANCE'] else 'PAID'
    
    # Calculate EventHub commission
    comm = calculate_commission(float(booking.total_amount), float(booking.commission_rate))
    booking.commission_amount = comm['commission_amount']
    
    db.commit()
    db.refresh(payment)
    db.refresh(booking)
    
    return {
        'payment': payment.to_dict(),
        'booking': booking.to_dict(),
        'transaction_reference': txn_ref,
        'message': 'Payment successful! Booking confirmed.'
    }
