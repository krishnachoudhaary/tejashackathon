from functools import wraps
from flask import request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from utils.helpers import error_response
from config.db_config import SessionLocal
from models.models import User

def jwt_required_custom(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            
            db = SessionLocal()
            try:
                # user_id in JWT identity might be string or int
                current_user = db.query(User).filter(User.id == int(user_id)).first()
                if not current_user:
                    return error_response("User account not found or deactivated", 401)
                
                # Pass current_user to controller function
                return fn(current_user=current_user, *args, **kwargs)
            finally:
                db.close()
        except Exception as e:
            return error_response(f"Authentication token invalid or expired: {str(e)}", 401)
    return wrapper
