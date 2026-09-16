import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { EventPlanner } from './pages/EventPlanner';
import { BudgetPlanner } from './pages/BudgetPlanner';
import { VendorListing } from './pages/VendorListing';
import { VendorDetails } from './pages/VendorDetails';
import { CompareVendors } from './pages/CompareVendors';
import { BookingSummary } from './pages/BookingSummary';
import { DemoPayment } from './pages/DemoPayment';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { MyEvent } from './pages/MyEvent';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Discovery & Planning */}
                <Route path="/" element={<Home />} />
                <Route path="/planner" element={<EventPlanner />} />
                <Route path="/budget-planner" element={<BudgetPlanner />} />
                <Route path="/vendors" element={<VendorListing />} />
                <Route path="/vendors/:id" element={<VendorDetails />} />
                <Route path="/compare" element={<CompareVendors />} />

                {/* Booking & Simulated Payment Workflow */}
                <Route path="/booking/summary" element={<BookingSummary />} />
                <Route path="/payment/demo" element={<DemoPayment />} />
                <Route path="/booking/confirmation" element={<BookingConfirmation />} />

                {/* Authenticated Portals */}
                <Route
                  path="/my-event"
                  element={
                    <ProtectedRoute>
                      <MyEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CompareProvider>
    </AuthProvider>
  );
}

export default App;
