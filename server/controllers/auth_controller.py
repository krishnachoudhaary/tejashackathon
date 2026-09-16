from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from config.db_config import SessionLocal
from models.models import User
from utils.helpers import success_response, error_response

def register():
    from flask import request
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return error_response("Invalid request format. Expected JSON object.", 400)

    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    phone = str(data.get('phone', '')).strip()
    role = str(data.get('role', 'CUSTOMER')).upper()
    city = str(data.get('city', 'Patna')).strip()

    if not name or not email or not password:
        return error_response("Name, email, and password are required fields", 400)

    if role not in ['CUSTOMER', 'VENDOR']:
        role = 'CUSTOMER'

    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return error_response("An account with this email already exists", 409)

        hashed_password = generate_password_hash(password)
        new_user = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            phone=phone,
            role=role,
            city=city
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Generate JWT token
        token = create_access_token(identity=str(new_user.id))
        return success_response({
            'token': token,
            'user': new_user.to_dict()
        }, "Registration successful", 201)
    except Exception as e:
        db.rollback()
        return error_response(f"Registration failed: {str(e)}", 500)
    finally:
        db.close()

def login():
    from flask import request
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return error_response("Invalid request format. Expected JSON object with email and password.", 400)

    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))

    if not email or not password:
        return error_response("Email and password are required", 400)

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return error_response("Invalid email or password", 401)

        token = create_access_token(identity=str(user.id))
        return success_response({
            'token': token,
            'user': user.to_dict()
        }, "Login successful", 200)
    except Exception as e:
        return error_response(f"Authentication failed: {str(e)}", 500)
    finally:
        db.close()

def get_current_user(current_user):
    return success_response({'user': current_user.to_dict()}, "User profile retrieved", 200)
