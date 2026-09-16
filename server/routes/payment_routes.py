from flask import Blueprint
from controllers.payment_controller import handle_demo_payment, get_payments_for_booking
from middleware.auth_middleware import jwt_required_custom

payment_bp = Blueprint('payment_bp', __name__)

payment_bp.route('/demo', methods=['POST'])(jwt_required_custom(handle_demo_payment))
payment_bp.route('/booking/<int:booking_id>', methods=['GET'])(jwt_required_custom(get_payments_for_booking))
