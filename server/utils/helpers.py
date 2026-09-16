import random
import string
from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    response = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(response), status_code

def error_response(message="An error occurred", status_code=400, errors=None):
    response = {
        "success": False,
        "message": message
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), status_code

def generate_booking_reference():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"EH-BK-{chars}"

def generate_demo_transaction_ref():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"EH-DEMO-{chars}"

def generate_refund_reference():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"EH-REFUND-{chars}"
