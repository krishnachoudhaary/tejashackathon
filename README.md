# EventHub 🎪
> **"Plan Smart. Spend Smart. Celebrate Better."**

EventHub is an all-in-one event planning, vendor discovery, comparison, and booking platform engineered specifically for **Tier-2 and Tier-3 cities in India** (Patna, Gaya, Muzaffarpur, Bhagalpur, Begusarai, Nalanda, Sheikhpura).

---

## 💡 The Core Idea & Differentiator

Traditional event directories merely list vendor contact numbers and leave users to guess prices, handle fragmentation, and blindly juggle budgets.

> **"EventHub doesn't just help users FIND vendors — it helps them PLAN their entire event within their budget."**

### Key Differentiators
1. **Rule-Based Smart Match Engine**: Analyzes location, guest capacity, service requirements, event type, and category price allowances to compute an explainable compatibility score out of 100%.
2. **Dynamic Budget Optimization**: Dynamically divides your overall event budget (e.g., ₹3,00,000) across Venue, Catering, Decoration, Photography, and DJ. Swapping a vendor instantly updates the allocated and remaining budget in real-time.
3. **Deep Venue Capacity Specs**: Displays maximum guest capacity, main hall capacity, conference hall, and outstation guest room counts.
4. **Side-by-Side Factual Comparison**: Compare up to 3 shortlisted vendors on capacity, price, rooms, and facilities without generic marketing claims.
5. **20% Advance Booking & Simulated Payment**: A realistic dummy payment workflow generating `EH-DEMO-XXXXXX` references with 20% advance collection and 80% onsite balance.
6. **Transparent Cancellation & Refund**: Clear fee disclosure (Advance Paid - Platform Fee = Refundable Amount) generating `EH-REFUND-XXXXXX`.
7. **Sustainable Revenue Model**: Transparent 10% platform vendor commission tracking.

---

## 🛠️ Technology Stack

```text
User
 ↓
React Frontend (React 18, React Router, Modern CSS)
 ↓ [REST APIs with JWT Header]
Python + Flask Backend (Blueprints, Controllers, Services)
 ↓ [SQLAlchemy / PyMySQL]
MySQL Database (with instant SQLite evaluation fallback)
```

- **Frontend**: React.js 18, Vite, React Router v6, Lucide Icons, Modern CSS Design System.
- **Backend**: Python 3.10+, Flask 3.0, Flask-JWT-Extended, Flask-CORS, SQLAlchemy 2.0.
- **Database**: MySQL (DDL Schema & Seed scripts in `database/`) with auto-fallback for zero-config evaluation.
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (`CUSTOMER`, `VENDOR`, `ADMIN`).

---

## 📂 Project Structure

```text
eventhub/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Brand graphics & event images
│   │   ├── components/         # Navbar, Footer, BudgetCard, MatchScore, VendorCard, CompareTable, etc.
│   │   ├── pages/              # Home, EventPlanner, BudgetPlanner, VendorListing, VendorDetails, MyEvent, etc.
│   │   ├── services/           # api.js (Fetch wrapper with JWT handling)
│   │   ├── context/            # AuthContext, CompareContext
│   │   ├── utils/              # formatters.js (₹ INR, date formatting)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Python Flask Backend
│   ├── config/
│   │   └── db_config.py        # Database pooling & config
│   ├── controllers/            # auth_controller, vendor_controller, event_controller, booking_controller, etc.
│   ├── middleware/             # auth_middleware (JWT), role_middleware (RBAC)
│   ├── models/                 # models.py (SQLAlchemy ORM)
│   ├── routes/                 # Flask Blueprints (auth_routes, vendor_routes, event_routes, etc.)
│   ├── services/               # smart_match_service, budget_service, payment_service, refund_service, commission_service
│   ├── utils/                  # helpers.py (UUID/Ref generators, response formatters)
│   ├── database/
│   │   └── db_init.py          # Auto-seeder and schema initializer
│   ├── app.py                  # Main Flask entrypoint
│   └── requirements.txt
│
├── database/
│   ├── schema.sql              # MySQL DDL table schema
│   ├── seed.sql                # 16+ Tier-2/3 vendor records & demo data
│   └── README.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MySQL Server (optional; SQLite fallback runs automatically if MySQL is offline)

### 2. Backend Setup
```bash
cd server

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask backend (starts on port 5050)
python app.py
```

### 3. Frontend Setup
```bash
cd client

# Install packages
npm install

# Start Vite React development server (starts on port 3000)
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Purpose |
|---|---|---|---|
| **Customer** | `demo@eventhub.com` | `Password123!` | Plan events, browse vendors, 20% advance booking, cancel & refund |
| **Vendor** | `vendor@eventhub.com` | `Password123!` | Manage Patliputra Grand Palace profile, venue capacity, accept bookings, commission stats |
| **Admin** | `admin@eventhub.com` | `Password123!` | Full platform administration |

*(The login page also provides 1-click Demo Fill buttons for instant testing).*

---

## 🧠 Smart Match Algorithm (100-Point System)

EventHub's recommendation engine evaluates vendor candidates using an explainable, rule-based approach:
1. **Location Match (20 pts)**: Exact city match = 20 pts; neighboring Tier-2/3 region = 8 pts.
2. **Budget Compatibility (25 pts)**: Within category budget allowance = 25 pts; up to 120% = 15 pts; up to 150% = 8 pts.
3. **Capacity Compatibility (20 pts)**: Venue max capacity $\ge$ guest count = 20 pts; within 80% = 10 pts.
4. **Service Category Match (15 pts)**: Vendor offers requested category and requested packages.
5. **Event Type Experience (10 pts)**: Explicit experience with Wedding, Birthday, Corporate, etc.
6. **Reputation & Verification (10 pts)**: Verified status and review ratings.

---

## 💰 Business & Commission Model

- **Primary Revenue**: EventHub earns a **10% platform commission** on confirmed vendor bookings.
- **Advance vs Revenue**: The customer pays a **20% advance** upon booking; remaining 80% is settled with the vendor. The 10% commission is deducted from the total booking value for platform earnings.
- **Cancellation Policy**: Advance Paid - Standard Platform Cancellation Fee (₹2,000) = Refundable Amount (simulated `EH-REFUND-XXXXXX`).

---

## 📡 REST API Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register customer or vendor | No |
| `POST` | `/api/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Yes |
| `GET` | `/api/vendors` | Search and filter vendors | No |
| `GET` | `/api/vendors/:id` | Get vendor details & venue capacity | No |
| `POST` | `/api/vendors/compare` | Side-by-side comparison (2-3 vendors) | No |
| `POST` | `/api/events` | Create event plan with Smart Match | Yes |
| `GET` | `/api/events/my-events` | Get all user events with dynamic budgets | Yes |
| `POST` | `/api/events/:id/replace-vendor` | Swap vendor with live recalculation | Yes |
| `POST` | `/api/budget/calculate` | Compute category target allocations | No |
| `POST` | `/api/bookings` | Create booking (20% advance split) | Yes |
| `GET` | `/api/bookings` | List user or vendor bookings | Yes |
| `POST` | `/api/payments/demo` | Process simulated advance payment | Yes |
| `POST` | `/api/bookings/:id/cancel` | Cancel booking & trigger refund | Yes |

---

## 🏆 Hackathon Demonstration Journey

1. **Homepage**: Showcase tagline, Tier-2/3 Bihar cities, and differentiators.
2. **Plan My Event**: Enter Wedding in Patna, 250 guests, ₹3,00,000 budget, select 5 services.
3. **Smart Match Plan**: View the generated plan (Total ₹3,00,000, Allocated ₹2,60,000, Remaining ₹40,000).
4. **Venue Specs**: Inspect Patliputra Grand Palace (400 max capacity, 12 AC rooms, 300 main hall).
5. **Side-by-Side Comparison**: Compare 3 venues on capacity, price, and rooms.
6. **Swap Vendor**: Replace a vendor and witness live budget recalculation.
7. **20% Advance Booking**: View summary (Total ₹70,000, Advance ₹14,000, Remaining ₹56,000).
8. **Simulated Payment**: Pay advance via UPI simulator (`EH-DEMO-XXXXXX`).
9. **My Event Dashboard**: Verify booking status (`CONFIRMED`, Advance Paid ✓).
10. **Cancellation & Refund**: Cancel booking, review policy breakdown (Fee deduction), and receive `EH-REFUND-XXXXXX`.
11. **Vendor Portal**: Log in as vendor, check 10% commission analytics, and manage venue capacity.
