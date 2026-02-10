import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/Layout/AdminLayout';
import PublicLayout from './components/Layout/PublicLayout';
import UserLayout from './components/Layout/UserLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductDetail from './pages/Products/ProductDetail';
import UserList from './pages/Admin/UserList';
import CategoryList from './pages/Admin/CategoryList';
import SchemeList from './pages/Admin/SchemeList';
import PolicyList from './pages/Admin/PolicyList';
import PaymentList from './pages/Admin/PaymentList';
import ClaimList from './pages/Admin/ClaimList';
import LoanList from './pages/Admin/LoanList';
import NewsList from './pages/Admin/NewsList';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import UserDashboard from './pages/User/UserDashboard';
import MyPolicies from './pages/User/MyPolicies';
import MyClaims from './pages/User/MyClaims';
import MyPayments from './pages/User/MyPayments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirects to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route path="/home" element={<PublicLayout />}>
          <Route index element={<Home />} />
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
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
          </Route>
        </Route>

        {/* User Routes - Protected */}
        <Route path="/user" element={<ProtectedRoute requiredRole="Customer" />}>
          <Route element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="policies" element={<MyPolicies />} />
            <Route path="claims" element={<MyClaims />} />
            <Route path="payments" element={<MyPayments />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
