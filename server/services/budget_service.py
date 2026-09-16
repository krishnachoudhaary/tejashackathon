CATEGORY_SPLIT_PERCENTAGES = {
    'wedding': {
        'Venue': 0.28,
        'Catering': 0.35,
        'Decoration': 0.15,
        'Photography': 0.14,
        'DJ': 0.08
    },
    'birthday': {
        'Venue': 0.25,
        'Catering': 0.40,
        'Decoration': 0.20,
        'Photography': 0.10,
        'DJ': 0.05
    },
    'engagement': {
        'Venue': 0.30,
        'Catering': 0.35,
        'Decoration': 0.15,
        'Photography': 0.12,
        'DJ': 0.08
    },
    'corporate': {
        'Venue': 0.35,
        'Catering': 0.35,
        'Decoration': 0.10,
        'Photography': 0.10,
        'DJ': 0.10
    },
    'anniversary': {
        'Venue': 0.30,
        'Catering': 0.35,
        'Decoration': 0.15,
        'Photography': 0.12,
        'DJ': 0.08
    }
}

DEFAULT_SPLIT = {
    'Venue': 0.30,
    'Catering': 0.35,
    'Decoration': 0.15,
    'Photography': 0.12,
    'DJ': 0.08
}

def calculate_budget_breakdown(total_budget, event_type='wedding', required_services=None):
    """
    Computes recommended budget distribution for each requested category.
    """
    event_key = event_type.strip().lower()
    split_map = CATEGORY_SPLIT_PERCENTAGES.get(event_key, DEFAULT_SPLIT)
    
    if not required_services:
        required_services = list(split_map.keys())
    
    # Filter for requested categories and normalize percentages to sum to 100%
    active_splits = {cat: split_map.get(cat, 0.15) for cat in required_services}
    total_weights = sum(active_splits.values()) or 1.0
    
    normalized_allocations = {}
    for cat, weight in active_splits.items():
        allocated = round((weight / total_weights) * total_budget, 2)
        normalized_allocations[cat] = allocated
        
    return normalized_allocations

def calculate_remaining_budget(total_budget, selected_items):
    """
    Dynamically sums allocated prices of selected vendors and determines remaining or exceeded budget.
    """
    allocated_total = sum(float(item.get('price', 0.0)) for item in selected_items)
    remaining = total_budget - allocated_total
    is_within_budget = remaining >= 0
    
    if is_within_budget:
        message = f"Your event plan is within budget (₹{remaining:,.2f} remaining)."
    else:
        exceeded_by = abs(remaining)
        message = f"Your selected plan exceeds the budget by ₹{exceeded_by:,.2f}."
        
    return {
        'total_budget': round(total_budget, 2),
        'allocated_budget': round(allocated_total, 2),
        'remaining_budget': round(remaining, 2),
        'is_within_budget': is_within_budget,
        'message': message
    }
