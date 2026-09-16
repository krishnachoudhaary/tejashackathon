from flask import Blueprint
from controllers.auth_controller import register, login, get_current_user
from middleware.auth_middleware import jwt_required_custom

auth_bp = Blueprint('auth_bp', __name__)

auth_bp.route('/register', methods=['POST'])(register)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/me', methods=['GET'])(jwt_required_custom(get_current_user))
