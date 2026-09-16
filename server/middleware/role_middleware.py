from functools import wraps
from utils.helpers import error_response

def role_required(*allowed_roles):
    """
    Decorator to restrict route access to specific roles (CUSTOMER, VENDOR, ADMIN).
    Must be used in combination with jwt_required_custom.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                return error_response("Authentication required", 401)
            
            if current_user.role not in allowed_roles:
                return error_response(
                    f"Access forbidden: Role '{current_user.role}' is not authorized to perform this action", 
                    403
                )
            return fn(*args, **kwargs)
        return wrapper
    return decorator
