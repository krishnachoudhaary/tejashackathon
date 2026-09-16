import os
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load env variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

from database.db_init import init_database
from routes.auth_routes import auth_bp
from routes.vendor_routes import vendor_bp
from routes.event_routes import event_bp
from routes.booking_routes import booking_bp
from routes.payment_routes import payment_bp
from routes.review_routes import review_bp
from services.budget_service import calculate_budget_breakdown, calculate_remaining_budget
from utils.helpers import success_response, error_response

def create_app():
    app = Flask(__name__)
    
    # Strong 64-character HMAC secret key
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'eventhub_super_secret_jwt_key_for_tier_2_3_bihar_event_planning_2026')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config['JSON_SORT_KEYS'] = False

    # Enable CORS for React client
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize JWT Manager
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({"success": False, "message": "Missing Authorization Header or Token"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({"success": False, "message": "Invalid JWT Token"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "JWT Token has expired"}), 401

    # Initialize database tables and seed records
    init_database()

    # Register API Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vendor_bp, url_prefix='/api/vendors')
    app.register_blueprint(event_bp, url_prefix='/api/events')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')

    # Standalone Budget Calculation Route
    @app.route('/api/budget/calculate', methods=['POST'])
    def budget_calculate():
        data = request.get_json() or {}
        total_budget = float(data.get('total_budget', 300000))
        event_type = data.get('event_type', 'Wedding')
        required_services = data.get('required_services', ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'])
        selected_items = data.get('selected_items', [])

        breakdown = calculate_budget_breakdown(total_budget, event_type, required_services)
        summary = calculate_remaining_budget(total_budget, selected_items)

        return success_response({
            'recommended_split': breakdown,
            'budget_summary': summary
        }, "Budget calculated successfully", 200)

    # Health Check API
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "app": "EventHub API",
            "tagline": "Plan Smart. Spend Smart. Celebrate Better.",
            "version": "1.0.0"
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5050))
    print(f"\n========================================================")
    print(f"  EVENTHUB BACKEND SERVER RUNNING ON PORT {port}")
    print(f"  Tagline: 'Plan Smart. Spend Smart. Celebrate Better.'")
    print(f"========================================================\n")
    app.run(host='0.0.0.0', port=port, debug=False)
