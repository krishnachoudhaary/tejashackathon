from flask import Blueprint
from controllers.review_controller import get_vendor_reviews, create_review
from middleware.auth_middleware import jwt_required_custom

review_bp = Blueprint('review_bp', __name__)

review_bp.route('/vendor/<int:vendor_id>', methods=['GET'])(get_vendor_reviews)
review_bp.route('', methods=['POST'])(jwt_required_custom(create_review))
