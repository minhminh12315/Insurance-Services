import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/Layout/AdminLayout';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

