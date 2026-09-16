from datetime import datetime
from flask import request
from config.db_config import SessionLocal
from models.models import Event, EventVendor, Vendor
from services.smart_match_service import calculate_vendor_smart_match
from services.budget_service import calculate_budget_breakdown, calculate_remaining_budget
from utils.helpers import success_response, error_response

def create_event_plan(current_user):
    data = request.get_json() or {}
    event_name = data.get('event_name', '').strip()
    event_type = data.get('event_type', 'Wedding').strip()
    city = data.get('city', 'Patna').strip()
    event_date_str = data.get('event_date')
    guest_count = int(data.get('guest_count', 250))
    total_budget = float(data.get('total_budget', 300000))
    required_services = data.get('required_services', ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'])

    if not event_date_str:
        return error_response("Event date is required", 400)
    
    try:
        event_date = datetime.strptime(event_date_str, '%Y-%m-%d').date()
    except ValueError:
        return error_response("Invalid date format. Use YYYY-MM-DD", 400)

    if not event_name:
        event_name = f"{current_user.name}'s {event_type} Celebration"

    db = SessionLocal()
    try:
        # 1. Calculate Recommended Budget Allocations per Category
        category_allocations = calculate_budget_breakdown(
            total_budget=total_budget,
            event_type=event_type,
            required_services=required_services
        )

        # 2. Find All Active Vendors
        all_vendors = db.query(Vendor).all()

        # 3. Perform Smart Matching & Auto-Select Best Vendor per Category
        selected_event_vendors = []
        selected_pricing_items = []
        smart_match_results = {}

        for category in required_services:
            cat_budget = category_allocations.get(category, total_budget / len(required_services))
            event_params = {
                'city': city,
                'event_type': event_type,
                'guest_count': guest_count,
                'total_budget': total_budget,
                'category_budget': cat_budget,
                'required_services': required_services
            }

            # Filter candidates for this category
            candidates = [v for v in all_vendors if v.category.lower() == category.lower()]
            
            # Score each candidate
            scored_candidates = []
            for vendor in candidates:
                match_info = calculate_vendor_smart_match(vendor, event_params)
                match_info['vendor_data'] = vendor.to_dict(include_details=True)
                scored_candidates.append(match_info)

            # Sort by match score descending
            scored_candidates.sort(key=lambda x: x['match_score'], reverse=True)
            smart_match_results[category] = scored_candidates

            # Select top candidate if available
            if scored_candidates:
                top_pick = scored_candidates[0]
                allocated_price = top_pick['starting_price']
                selected_event_vendors.append({
                    'category': category,
                    'vendor_id': top_pick['vendor_id'],
                    'allocated_price': allocated_price,
                    'match_info': top_pick
                })
                selected_pricing_items.append({'price': allocated_price})

        # 4. Calculate Final Budget Status
        budget_summary = calculate_remaining_budget(total_budget, selected_pricing_items)

        # 5. Save Event to DB
        services_str = ','.join(required_services)
        new_event = Event(
            user_id=current_user.id,
            event_name=event_name,
            event_type=event_type,
            city=city,
            event_date=event_date,
            guest_count=guest_count,
            total_budget=total_budget,
            allocated_budget=budget_summary['allocated_budget'],
            remaining_budget=budget_summary['remaining_budget'],
            required_services=services_str,
            status='PLANNING'
        )
        db.add(new_event)
        db.flush()

        # Save Selected Event Vendors
        for item in selected_event_vendors:
            ev = EventVendor(
                event_id=new_event.id,
                vendor_id=item['vendor_id'],
                category=item['category'],
                allocated_price=item['allocated_price']
            )
            db.add(ev)

        db.commit()
        db.refresh(new_event)

        event_dict = new_event.to_dict(include_vendors=True)
        event_dict['smart_matches'] = smart_match_results
        event_dict['category_budget_targets'] = category_allocations
        event_dict['budget_status'] = budget_summary

        return success_response(event_dict, "Smart event plan generated successfully", 201)

    except Exception as e:
        db.rollback()
        return error_response(f"Failed to create event plan: {str(e)}", 500)
    finally:
        db.close()

def get_event_by_id(event_id, current_user):
    db = SessionLocal()
    try:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            return error_response("Event not found", 404)

        if event.user_id != current_user.id and current_user.role != 'ADMIN':
            return error_response("Unauthorized access to this event", 403)

        event_dict = event.to_dict(include_vendors=True)
        
        # Calculate dynamic budget
        pricing_items = [{'price': float(ev.allocated_price)} for ev in event.event_vendors]
        budget_summary = calculate_remaining_budget(float(event.total_budget), pricing_items)
        event_dict['budget_status'] = budget_summary

        # Add smart match alternatives for easy replacement
        all_vendors = db.query(Vendor).all()
        required_services = event_dict.get('required_services', [])
        category_targets = calculate_budget_breakdown(float(event.total_budget), event.event_type, required_services)
        
        smart_matches = {}
        for cat in required_services:
            cat_budget = category_targets.get(cat, float(event.total_budget) / max(1, len(required_services)))
            params = {
                'city': event.city,
                'event_type': event.event_type,
                'guest_count': event.guest_count,
                'total_budget': float(event.total_budget),
                'category_budget': cat_budget,
                'required_services': required_services
            }
            candidates = [v for v in all_vendors if v.category.lower() == cat.lower()]
            scored = []
            for vendor in candidates:
                info = calculate_vendor_smart_match(vendor, params)
                info['vendor_data'] = vendor.to_dict(include_details=True)
                scored.append(info)
            scored.sort(key=lambda x: x['match_score'], reverse=True)
            smart_matches[cat] = scored

        event_dict['smart_matches'] = smart_matches
        event_dict['category_budget_targets'] = category_targets

        return success_response(event_dict, "Event details retrieved", 200)
    finally:
        db.close()

def get_user_events(current_user):
    db = SessionLocal()
    try:
        events = db.query(Event).filter(Event.user_id == current_user.id).order_by(Event.created_at.desc()).all()
        result = []
        for ev in events:
            ev_dict = ev.to_dict(include_vendors=True)
            pricing_items = [{'price': float(v.allocated_price)} for v in ev.event_vendors]
            ev_dict['budget_status'] = calculate_remaining_budget(float(ev.total_budget), pricing_items)
            result.append(ev_dict)

        return success_response({'events': result}, "User events fetched", 200)
    finally:
        db.close()

def replace_event_vendor(event_id, current_user):
    data = request.get_json() or {}
    category = data.get('category')
    new_vendor_id = data.get('vendor_id')

    if not category or not new_vendor_id:
        return error_response("Category and new vendor_id are required", 400)

    db = SessionLocal()
    try:
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            return error_response("Event not found", 404)

        if event.user_id != current_user.id and current_user.role != 'ADMIN':
            return error_response("Unauthorized", 403)

        new_vendor = db.query(Vendor).filter(Vendor.id == new_vendor_id).first()
        if not new_vendor:
            return error_response("New vendor not found", 404)

        # Find existing event vendor entry or create
        ev = db.query(EventVendor).filter(
            EventVendor.event_id == event.id,
            EventVendor.category == category
        ).first()

        new_price = float(new_vendor.starting_price) if new_vendor.starting_price is not None else 0.0

        if ev:
            ev.vendor_id = new_vendor.id
            ev.allocated_price = new_price
        else:
            ev = EventVendor(
                event_id=event.id,
                vendor_id=new_vendor.id,
                category=category,
                allocated_price=new_price
            )
            db.add(ev)

        db.flush()

        # Recalculate event totals
        all_evs = db.query(EventVendor).filter(EventVendor.event_id == event.id).all()
        pricing_items = [{'price': float(item.allocated_price)} for item in all_evs]
        budget_summary = calculate_remaining_budget(float(event.total_budget), pricing_items)

        event.allocated_budget = budget_summary['allocated_budget']
        event.remaining_budget = budget_summary['remaining_budget']

        db.commit()
        db.refresh(event)

        event_dict = event.to_dict(include_vendors=True)
        event_dict['budget_status'] = budget_summary
        return success_response(event_dict, f"Vendor for {category} updated to {new_vendor.business_name}", 200)

    except Exception as e:
        db.rollback()
        return error_response(f"Failed to update vendor: {str(e)}", 500)
    finally:
        db.close()

def run_smart_match_query():
    data = request.get_json() or {}
    city = data.get('city', 'Patna')
    event_type = data.get('event_type', 'Wedding')
    guest_count = int(data.get('guest_count', 250))
    total_budget = float(data.get('total_budget', 300000))
    required_services = data.get('required_services', ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'])

    db = SessionLocal()
    try:
        targets = calculate_budget_breakdown(total_budget, event_type, required_services)
        all_vendors = db.query(Vendor).all()

        results = {}
        for cat in required_services:
            cat_budget = targets.get(cat, total_budget / max(1, len(required_services)))
            params = {
                'city': city,
                'event_type': event_type,
                'guest_count': guest_count,
                'total_budget': total_budget,
                'category_budget': cat_budget,
                'required_services': required_services
            }
            candidates = [v for v in all_vendors if v.category.lower() == cat.lower()]
            scored = []
            for vendor in candidates:
                match_info = calculate_vendor_smart_match(vendor, params)
                match_info['vendor_data'] = vendor.to_dict(include_details=True)
                scored.append(match_info)
            scored.sort(key=lambda x: x['match_score'], reverse=True)
            results[cat] = scored

        return success_response({
            'smart_matches': results,
            'category_targets': targets
        }, "Smart matches generated", 200)
    finally:
        db.close()
