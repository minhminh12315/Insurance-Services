import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/Layout/AdminLayout';
import PublicLayout from './components/Layout/PublicLayout';
import UserLayout from './components/Layout/UserLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

import UserList from './pages/Admin/UserList';
import CategoryList from './pages/Admin/CategoryList';
import SchemeList from './pages/Admin/SchemeList';
import PolicyList from './pages/Admin/PolicyList';
import PaymentList from './pages/Admin/PaymentList';
import ClaimList from './pages/Admin/ClaimList';
import LoanList from './pages/Admin/LoanList';
import NewsList from './pages/Admin/NewsList';
import Profile from './pages/Admin/Profile';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Appointment from './pages/Appointment';
import TeamMembers from './pages/TeamMembers';
import Testimonial from './pages/Testimonial';
import NotFound from './pages/NotFound';
import MyPolicies from './pages/User/MyPolicies';
import UserPolicyDetail from './pages/User/UserPolicyDetail';
import UserProfile from './pages/User/Profile';
import PremiumCalculator from './pages/User/PremiumCalculator';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Root redirects to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route path="/home" element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/calculator" element={<PublicLayout />}>
          <Route index element={<PremiumCalculator />} />
        </Route>
        <Route path="/about" element={<PublicLayout />}>
          <Route index element={<About />} />
        </Route>
        <Route path="/services" element={<PublicLayout />}>
          <Route index element={<Services />} />
        </Route>
        <Route path="/contact" element={<PublicLayout />}>
          <Route index element={<Contact />} />
        </Route>
        <Route path="/features" element={<PublicLayout />}>
          <Route index element={<Features />} />
        </Route>
        <Route path="/appointment" element={<PublicLayout />}>
          <Route index element={<Appointment />} />
        </Route>
        <Route path="/team" element={<PublicLayout />}>
          <Route index element={<TeamMembers />} />
        </Route>
        <Route path="/testimonial" element={<PublicLayout />}>
          <Route index element={<Testimonial />} />
        </Route>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="Admin" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="schemes" element={<SchemeList />} />
            <Route path="policies" element={<PolicyList />} />
            <Route path="payments" element={<PaymentList />} />
            <Route path="claims" element={<ClaimList />} />
            <Route path="loans" element={<LoanList />} />
            <Route path="news" element={<NewsList />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/user" element={<ProtectedRoute requiredRole="Customer" />}>
          <Route element={<UserLayout />}>
            <Route index element={<MyPolicies />} />
            <Route path="policies" element={<MyPolicies />} />
            <Route path="policies/:id" element={<UserPolicyDetail />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
