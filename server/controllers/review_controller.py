from flask import request
from config.db_config import SessionLocal
from models.models import Review, Vendor
from utils.helpers import success_response, error_response

def get_vendor_reviews(vendor_id):
    db = SessionLocal()
    try:
        reviews = db.query(Review).filter(Review.vendor_id == vendor_id).order_by(Review.created_at.desc()).all()
        return success_response({
            'count': len(reviews),
            'reviews': [r.to_dict() for r in reviews]
        }, "Reviews fetched successfully", 200)
    finally:
        db.close()

def create_review(current_user):
    data = request.get_json() or {}
    vendor_id = data.get('vendor_id')
    rating = int(data.get('rating', 5))
    comment = data.get('comment', '').strip()
    booking_id = data.get('booking_id')

    if not vendor_id or rating < 1 or rating > 5 or not comment:
        return error_response("Vendor ID, valid rating (1-5), and comment are required", 400)

    db = SessionLocal()
    try:
        vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            return error_response("Vendor not found", 404)

        review = Review(
            vendor_id=vendor_id,
            user_id=current_user.id,
            booking_id=booking_id,
            rating=rating,
            comment=comment
        )
        db.add(review)
        db.flush()

        # Update vendor average rating and review count
        all_revs = db.query(Review).filter(Review.vendor_id == vendor_id).all()
        total_rating = sum(r.rating for r in all_revs)
        vendor.review_count = len(all_revs)
        vendor.rating = round(total_rating / len(all_revs), 1)

        db.commit()
        db.refresh(review)
        return success_response(review.to_dict(), "Review submitted successfully", 201)

    except Exception as e:
        db.rollback()
        return error_response(f"Failed to submit review: {str(e)}", 500)
    finally:
        db.close()
