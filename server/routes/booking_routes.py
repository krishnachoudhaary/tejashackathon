from flask import Blueprint
from controllers.booking_controller import create_booking, get_bookings, get_booking_by_id, update_booking_status, cancel_booking
from middleware.auth_middleware import jwt_required_custom

booking_bp = Blueprint('booking_bp', __name__)

booking_bp.route('', methods=['POST'])(jwt_required_custom(create_booking))
booking_bp.route('', methods=['GET'])(jwt_required_custom(get_bookings))
booking_bp.route('/<int:booking_id>', methods=['GET'])(jwt_required_custom(get_booking_by_id))
booking_bp.route('/<int:booking_id>/status', methods=['PUT'])(jwt_required_custom(update_booking_status))
booking_bp.route('/<int:booking_id>/cancel', methods=['POST'])(jwt_required_custom(cancel_booking))
