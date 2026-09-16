from flask import request
from sqlalchemy import or_, and_
from config.db_config import SessionLocal
from models.models import Vendor, Venue, VendorService, Review
from services.smart_match_service import calculate_vendor_smart_match
from utils.helpers import success_response, error_response

def get_vendors():
    city = request.args.get('city', '').strip()
    category = request.args.get('category', '').strip()
    search = request.args.get('search', '').strip()
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    min_rating = request.args.get('min_rating', type=float)
    min_capacity = request.args.get('min_capacity', type=int)
    sort_by = request.args.get('sort_by', 'rating_desc') # price_asc, price_desc, rating_desc

    db = SessionLocal()
    try:
        query = db.query(Vendor)

        if city and city.lower() != 'all':
            query = query.filter(Vendor.city.ilike(f"%{city}%"))

        if category and category.lower() != 'all':
            query = query.filter(Vendor.category.ilike(f"%{category}%"))

        if search:
            query = query.filter(
                or_(
                    Vendor.business_name.ilike(f"%{search}%"),
                    Vendor.description.ilike(f"%{search}%"),
                    Vendor.address.ilike(f"%{search}%")
                )
            )

        if min_price is not None:
            query = query.filter(Vendor.starting_price >= min_price)

        if max_price is not None:
            query = query.filter(Vendor.starting_price <= max_price)

        if min_rating is not None:
            query = query.filter(Vendor.rating >= min_rating)

        if min_capacity is not None:
            query = query.join(Venue, Vendor.id == Venue.vendor_id).filter(Venue.max_capacity >= min_capacity)

        # Sorting
        if sort_by == 'price_asc':
            query = query.order_by(Vendor.starting_price.asc())
        elif sort_by == 'price_desc':
            query = query.order_by(Vendor.starting_price.desc())
        else: # rating_desc default
            query = query.order_by(Vendor.rating.desc(), Vendor.review_count.desc())

        vendors = query.all()
        return success_response({
            'count': len(vendors),
            'vendors': [v.to_dict(include_details=True) for v in vendors]
        }, "Vendors fetched successfully", 200)
    finally:
        db.close()

def get_vendor_by_id(vendor_id):
    db = SessionLocal()
    try:
        vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            return error_response("Vendor not found", 404)
        return success_response(vendor.to_dict(include_details=True), "Vendor details retrieved", 200)
    finally:
        db.close()

def compare_vendors():
    data = request.get_json() or {}
    vendor_ids = data.get('vendor_ids', [])

    if not vendor_ids or not isinstance(vendor_ids, list):
        return error_response("Please provide a list of 2 to 3 vendor IDs to compare", 400)

    if len(vendor_ids) > 4:
        return error_response("You can compare at most 4 vendors at a time", 400)

    db = SessionLocal()
    try:
        vendors = db.query(Vendor).filter(Vendor.id.in_(vendor_ids)).all()
        if not vendors:
            return error_response("No matching vendors found", 404)

        comparison_list = []
        for v in vendors:
            v_dict = v.to_dict(include_details=True)
            venue_info = v_dict.get('venue_details', {})
            comparison_list.append({
                'id': v.id,
                'business_name': v.business_name,
                'category': v.category,
                'city': v.city,
                'starting_price': v_dict['starting_price'],
                'price_unit': v.price_unit,
                'rating': v_dict['rating'],
                'review_count': v.review_count,
                'is_verified': v.is_verified,
                'max_capacity': venue_info.get('max_capacity') if venue_info else 'N/A',
                'main_hall_capacity': venue_info.get('main_hall_capacity') if venue_info else 'N/A',
                'rooms_available': venue_info.get('rooms_available') if venue_info else 'N/A',
                'lawn_available': venue_info.get('lawn_available') if venue_info else 'N/A',
                'catering_policy': venue_info.get('catering_policy') if venue_info else 'N/A',
                'ac_available': venue_info.get('ac_available') if venue_info else 'N/A',
                'facilities': venue_info.get('facilities') if venue_info else 'Standard Services Available',
                'services_count': len(v_dict.get('services', [])),
                'supported_event_types': v_dict['supported_event_types']
            })

        return success_response({'comparison': comparison_list}, "Comparison data generated", 200)
    finally:
        db.close()

def update_vendor_profile(current_user):
    data = request.get_json() or {}
    db = SessionLocal()
    try:
        vendor = db.query(Vendor).filter(Vendor.user_id == current_user.id).first()
        if not vendor:
            # Create a new vendor profile linked to this user
            vendor = Vendor(
                user_id=current_user.id,
                business_name=data.get('business_name', current_user.name),
                category=data.get('category', 'Venue'),
                city=data.get('city', current_user.city or 'Patna'),
                address=data.get('address', ''),
                description=data.get('description', ''),
                starting_price=float(data.get('starting_price', 50000.0)),
                price_unit=data.get('price_unit', 'per event'),
                contact_phone=data.get('contact_phone', current_user.phone),
                contact_email=data.get('contact_email', current_user.email),
                is_verified=True
            )
            db.add(vendor)
            db.flush()
        else:
            if 'business_name' in data: vendor.business_name = data['business_name']
            if 'category' in data: vendor.category = data['category']
            if 'city' in data: vendor.city = data['city']
            if 'address' in data: vendor.address = data['address']
            if 'description' in data: vendor.description = data['description']
            if 'starting_price' in data: vendor.starting_price = float(data['starting_price'])
            if 'price_unit' in data: vendor.price_unit = data['price_unit']
            if 'contact_phone' in data: vendor.contact_phone = data['contact_phone']
            if 'contact_email' in data: vendor.contact_email = data['contact_email']

        # Update or create Venue details if category is Venue
        if vendor.category == 'Venue' and 'venue_details' in data:
            v_data = data['venue_details']
            venue = db.query(Venue).filter(Venue.vendor_id == vendor.id).first()
            if not venue:
                venue = Venue(vendor_id=vendor.id)
                db.add(venue)
            venue.max_capacity = int(v_data.get('max_capacity', 300))
            venue.main_hall_capacity = int(v_data.get('main_hall_capacity', 200))
            venue.conference_hall_capacity = int(v_data.get('conference_hall_capacity', 100))
            venue.rooms_available = int(v_data.get('rooms_available', 8))
            venue.lawn_available = bool(v_data.get('lawn_available', True))
            venue.parking_capacity = int(v_data.get('parking_capacity', 50))
            venue.facilities = v_data.get('facilities', '')

        db.commit()
        db.refresh(vendor)
        return success_response(vendor.to_dict(include_details=True), "Vendor profile updated successfully", 200)
    except Exception as e:
        db.rollback()
        return error_response(f"Failed to update profile: {str(e)}", 500)
    finally:
        db.close()
