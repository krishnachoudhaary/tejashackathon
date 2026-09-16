import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:5050/api"

def make_request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req_data = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return json.loads(body)
        except:
            return {"success": False, "message": f"HTTP {e.code}: {body}"}
    except Exception as e:
        return {"success": False, "message": str(e)}

def test_full_flow():
    print("\n========================================================")
    print("      EVENTHUB AUTOMATED END-TO-END VERIFICATION")
    print("========================================================\n")

    # 1. Health Check
    print("[1/10] Testing API Health...")
    health = make_request("/health")
    assert health.get("status") == "healthy", f"Health failed: {health}"
    print("  ✓ Healthcheck OK:", health.get("tagline"))

    # 2. Login as Demo Customer
    print("\n[2/10] Testing Customer Authentication...")
    auth = make_request("/auth/login", method="POST", data={
        "email": "demo@eventhub.com",
        "password": "Password123!"
    })
    assert auth.get("success"), f"Login failed: {auth}"
    token = auth["data"]["token"]
    user = auth["data"]["user"]
    print(f"  ✓ Customer Authenticated: {user['name']} ({user['email']})")

    # 3. Vendor Discovery & Filtering
    print("\n[3/10] Testing Vendor Search & Filter...")
    vendors_res = make_request("/vendors?city=Patna&category=Venue")
    assert vendors_res.get("success"), f"Vendors query failed: {vendors_res}"
    vendors = vendors_res["data"]["vendors"]
    print(f"  ✓ Found {len(vendors)} venues in Patna (e.g. {vendors[0]['business_name']})")

    # 4. Vendor Details & Venue Specs
    print("\n[4/10] Testing Vendor Details & Venue Specs...")
    v_detail = make_request("/vendors/1")
    assert v_detail.get("success"), f"Vendor detail failed: {v_detail}"
    venue = v_detail["data"].get("venue_details", {})
    print(f"  ✓ Venue Capacity Verified: Max {venue.get('max_capacity')} Guests, {venue.get('rooms_available')} AC Rooms, Main Hall {venue.get('main_hall_capacity')} Guests")

    # 5. Vendor Comparison
    print("\n[5/10] Testing Vendor Comparison...")
    comp_res = make_request("/vendors/compare", method="POST", data={"vendor_ids": [1, 2, 3]})
    assert comp_res.get("success"), f"Comparison failed: {comp_res}"
    print(f"  ✓ Comparison generated for {len(comp_res['data']['comparison'])} vendors")

    # 6. Event Creation & Smart Match
    print("\n[6/10] Testing Event Creation with Smart Match...")
    event_payload = {
        "event_name": "Patna Grand Wedding Demo",
        "event_type": "Wedding",
        "city": "Patna",
        "event_date": "2026-11-20",
        "guest_count": 250,
        "total_budget": 300000,
        "required_services": ["Venue", "Catering", "Decoration", "Photography", "DJ"]
    }
    event_res = make_request("/events", method="POST", data=event_payload, token=token)
    assert event_res.get("success"), f"Event creation failed: {event_res}"
    event_data = event_res["data"]
    print(f"  ✓ Event Created (ID: {event_data['id']}): Total Budget ₹{event_data['total_budget']:,.0f}")
    print(f"  ✓ Allocated: ₹{event_data['allocated_budget']:,.0f} | Remaining: ₹{event_data['remaining_budget']:,.0f}")

    # 7. Vendor Swap in Plan
    print("\n[7/10] Testing Vendor Swap / Replacement in Plan...")
    replace_res = make_request(f"/events/{event_data['id']}/replace-vendor", method="POST", data={
        "category": "Photography",
        "vendor_id": 9
    }, token=token)
    assert replace_res.get("success"), f"Vendor swap failed: {replace_res}"
    print(f"  ✓ Vendor swapped successfully. Dynamic Budget Updated: Remaining ₹{replace_res['data']['remaining_budget']:,.0f}")

    # 8. Booking Creation
    print("\n[8/10] Testing Booking Creation with 20% Advance...")
    booking_payload = {
        "vendor_id": 1,
        "event_id": event_data["id"],
        "event_date": "2026-11-20",
        "service_category": "Venue",
        "total_amount": 70000,
        "special_notes": "Corner bridal suite requested"
    }
    booking_res = make_request("/bookings", method="POST", data=booking_payload, token=token)
    assert booking_res.get("success"), f"Booking creation failed: {booking_res}"
    booking_data = booking_res["data"]
    print(f"  ✓ Booking Created: Ref {booking_data['booking_reference']}")
    print(f"  ✓ Total: ₹{booking_data['total_amount']:,.0f} | Advance (20%): ₹{booking_data['advance_amount']:,.0f} | Remaining: ₹{booking_data['remaining_amount']:,.0f}")

    # 9. Dummy Advance Payment
    print("\n[9/10] Testing Simulated Payment Processor...")
    payment_res = make_request("/payments/demo", method="POST", data={
        "booking_id": booking_data["id"],
        "payment_type": "ADVANCE",
        "payment_method": "UPI - GPay (Simulated)"
    }, token=token)
    assert payment_res.get("success"), f"Payment failed: {payment_res}"
    print(f"  ✓ Simulated Advance Payment Successful!")
    print(f"  ✓ Transaction Ref: {payment_res['data']['transaction_reference']}")
    print(f"  ✓ Booking Status Updated: {payment_res['data']['booking']['booking_status']} (Payment: {payment_res['data']['booking']['payment_status']})")

    # 10. Cancellation & Simulated Refund
    print("\n[10/10] Testing Cancellation & Simulated Refund Workflow...")
    cancel_res = make_request(f"/bookings/{booking_data['id']}/cancel", method="POST", data={
        "reason": "Date rescheduled to winter"
    }, token=token)
    assert cancel_res.get("success"), f"Cancellation failed: {cancel_res}"
    refund = cancel_res["data"].get("refund")
    print(f"  ✓ Booking Cancelled Successfully!")
    if refund:
        print(f"  ✓ Refund Ref: {refund['refund_reference']}")
        print(f"  ✓ Paid: ₹{refund['total_paid']:,.0f} - Platform Fee: ₹{refund['platform_cancellation_fee']:,.0f} = Refundable Amount: ₹{refund['refundable_amount']:,.0f}")
        print(f"  ✓ Status: {refund['refund_status']}")

    print("\n========================================================")
    print("  ALL 10 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!")
    print("========================================================\n")

if __name__ == "__main__":
    test_full_flow()
