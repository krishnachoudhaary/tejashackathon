from config.db_config import COMMISSION_RATE

def calculate_commission(booking_total, custom_rate=None):
    """
    Computes EventHub platform commission from successful vendor booking.
    """
    rate = custom_rate if custom_rate is not None else COMMISSION_RATE
    commission_amount = round(booking_total * rate, 2)
    vendor_payout = round(booking_total - commission_amount, 2)
    
    return {
        'booking_total': round(booking_total, 2),
        'commission_rate': rate,
        'commission_amount': commission_amount,
        'vendor_payout': vendor_payout
    }
