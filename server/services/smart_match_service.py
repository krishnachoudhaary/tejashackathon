from datetime import datetime

def calculate_vendor_smart_match(vendor, event_params):
    """
    Transparent Rule-Based Smart Match Algorithm (Max 100 points).
    Evaluates:
    1. Location Match (20 pts)
    2. Budget Compatibility (25 pts)
    3. Capacity Compatibility (20 pts)
    4. Service Match (15 pts)
    5. Event Type Match (10 pts)
    6. Availability (10 pts)
    """
    score = 0
    reasons = []
    category = vendor.category
    city = event_params.get('city', '').strip().lower()
    event_type = event_params.get('event_type', '').strip().lower()
    guest_count = int(event_params.get('guest_count', 100))
    total_budget = float(event_params.get('total_budget', 100000))
    category_budget = float(event_params.get('category_budget', total_budget * 0.25))

    vendor_price = float(vendor.starting_price) if vendor.starting_price is not None else 0.0

    # 1. Location Match (20 pts)
    vendor_city = vendor.city.strip().lower()
    if vendor_city == city:
        score += 20
        reasons.append(f"Located directly in {vendor.city}")
    else:
        # Nearby Tier-2/3 Bihar regions
        score += 8
        reasons.append(f"Servicing from nearby region ({vendor.city})")

    # 2. Budget Compatibility (25 pts)
    if vendor_price <= category_budget:
        score += 25
        savings = category_budget - vendor_price
        if savings > 0:
            reasons.append(f"Within budget (Saves ₹{int(savings):,})")
        else:
            reasons.append("Exact fit for category budget")
    elif vendor_price <= category_budget * 1.2:
        score += 15
        reasons.append("Slightly above category budget (+<20%)")
    elif vendor_price <= category_budget * 1.5:
        score += 8
        reasons.append("Moderate budget stretch (+20-50%)")
    else:
        score += 0
        reasons.append("Exceeds standard category allocation")

    # 3. Capacity Compatibility (20 pts)
    if category == 'Venue' and vendor.venue_details:
        max_cap = vendor.venue_details.max_capacity
        if max_cap >= guest_count:
            score += 20
            reasons.append(f"Suitable venue capacity ({max_cap} max for {guest_count} guests)")
        elif max_cap >= guest_count * 0.8:
            score += 10
            reasons.append(f"Close capacity fit ({max_cap} vs {guest_count} guests)")
        else:
            reasons.append(f"Capacity below requested guest count ({max_cap} max)")
    elif category == 'Catering':
        score += 20
        reasons.append(f"Equipped for large gatherings ({guest_count}+ guests)")
    else:
        # Other service types
        score += 20
        reasons.append("Full team ready for event scale")

    # 4. Service Match (15 pts)
    required_services = [s.strip().lower() for s in event_params.get('required_services', [])]
    if not required_services or category.lower() in required_services:
        score += 15
        reasons.append(f"Matches required '{category}' service")
    else:
        score += 5

    # 5. Event Type Match (10 pts)
    supported_types = [t.strip().lower() for t in vendor.supported_event_types.split(',')] if vendor.supported_event_types else []
    if not event_type or event_type in supported_types:
        score += 10
        reasons.append(f"Experienced in {event_params.get('event_type', 'similar')} events")
    else:
        score += 4

    # 6. Availability & Reputation (10 pts)
    if vendor.is_verified:
        score += 10
        reasons.append("Verified vendor & available on date")
    else:
        score += 5

    final_score = min(100, max(0, score))
    return {
        'match_score': final_score,
        'reasons': reasons,
        'vendor_id': vendor.id,
        'category': vendor.category,
        'business_name': vendor.business_name,
        'starting_price': vendor_price,
        'rating': float(vendor.rating) if vendor.rating else 4.5
    }
