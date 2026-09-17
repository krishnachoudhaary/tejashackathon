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
React Frontend (React 18, React Router v6, Lucide Icons, Vite)
 ↓ [REST APIs with JWT Bearer Header]
Node.js + Express.js Backend (REST APIs, Services, Controllers, Middleware)
 ↓ [mysql2 / Dual In-Memory Database Engine]
MySQL Database (with built-in resilient In-Memory store fallback for instant zero-config launch)
```

- **Frontend**: React.js 18, Vite, React Router v6, Lucide Icons, pure responsive CSS3.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS.
- **Database**: MySQL (DDL Schema & Seed scripts in `database/`) with automatic built-in zero-config store fallback.
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (`CUSTOMER`, `VENDOR`, `ADMIN`).

---

## 📂 Project Structure

```text
eventhub/
├── client/                     # React Frontend (Vite)
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
│   └── vite.config.js          # Configured with proxy to backend port 5001
│
├── server/                     # Node.js Express Backend
│   ├── config/                 # db.js (Dual MySQL/In-memory store), jwt.js
│   ├── controllers/            # authController, vendorController, eventController, bookingController, etc.
│   ├── middleware/             # authMiddleware (JWT), roleMiddleware (RBAC), errorHandler
│   ├── routes/                 # Express Routers (authRoutes, vendorRoutes, eventRoutes, etc.)
│   ├── services/               # smartMatchService, budgetService, paymentService, refundService
│   ├── database/               # seedData.js (15+ Tier-2/3 seed vendors)
│   ├── app.js                  # Express App configuration & unified SPA serving
│   ├── server.js               # Main Server entrypoint (Port 5001)
│   └── package.json
│
├── database/
│   ├── schema.sql              # MySQL DDL table schema
│   └── seed.sql                # 15+ Tier-2/3 vendor records & demo data
│
├── .env.example
├── .env
├── package.json                # Root scripts for single-command start/build
└── README.md
```

---

## 🚀 Quick Setup & Installation (VS Code / Terminal)

### Option 1: Unified Full-Stack Run (Recommended — Single Command)
This builds the React frontend and starts the Express backend serving both the REST API and the React SPA on **http://localhost:5001**:

```bash
# 1. Install all dependencies for both client and server
npm run install:all

# 2. Build frontend assets
npm run build:client

# 3. Start unified application
npm start
```
Open **http://localhost:5001** in your browser.

---

### Option 2: Running Frontend & Backend Separately in VS Code

Open two integrated terminals in VS Code (`Ctrl+\`` or `Cmd+\``):

**Terminal 1 — Backend (Node.js Express):**
```bash
cd server
npm install
npm start
```
> Server starts on **http://localhost:5001** with zero-config in-memory database fallback (no MySQL setup required).

**Terminal 2 — Frontend (Vite React Dev Server):**
```bash
cd client
npm install
npm run dev
```
> Client starts on **http://localhost:3000** with automatic proxying to backend on port 5001.

---

## 🔑 Demo Credentials

| Role | Email / Username | Password | Purpose |
|---|---|---|---|
| **Customer** | `demo@eventhub.com` | `password123` | Plan events, browse vendors, 20% advance booking, cancel & refund |
| **Vendor** | `vendor@eventhub.com` | `password123` | Manage Patliputra Grand Palace profile, venue capacity, accept bookings, commission stats |
| **Venue Demo** | `royalpalace@eventhub.com` | `password123` | Manage Royal Palace Hotel profile |

*(The login page also provides 1-click **Quick Demo Login** buttons for instant access).*

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
