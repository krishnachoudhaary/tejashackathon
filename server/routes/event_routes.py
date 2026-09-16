from flask import Blueprint
from controllers.event_controller import create_event_plan, get_event_by_id, get_user_events, replace_event_vendor, run_smart_match_query
from middleware.auth_middleware import jwt_required_custom

event_bp = Blueprint('event_bp', __name__)

event_bp.route('', methods=['POST'])(jwt_required_custom(create_event_plan))
event_bp.route('/my-events', methods=['GET'])(jwt_required_custom(get_user_events))
event_bp.route('/<int:event_id>', methods=['GET'])(jwt_required_custom(get_event_by_id))
event_bp.route('/<int:event_id>/replace-vendor', methods=['POST'])(jwt_required_custom(replace_event_vendor))
event_bp.route('/smart-match', methods=['POST'])(run_smart_match_query)
