from flask import Blueprint
from controllers.vendor_controller import get_vendors, get_vendor_by_id, compare_vendors, update_vendor_profile
from middleware.auth_middleware import jwt_required_custom
from middleware.role_middleware import role_required

vendor_bp = Blueprint('vendor_bp', __name__)

vendor_bp.route('', methods=['GET'])(get_vendors)
vendor_bp.route('/<int:vendor_id>', methods=['GET'])(get_vendor_by_id)
vendor_bp.route('/compare', methods=['POST'])(compare_vendors)
vendor_bp.route('/profile', methods=['PUT', 'POST'])(jwt_required_custom(role_required('VENDOR', 'ADMIN')(update_vendor_profile)))
