import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import DetailPage from './pages/DetailPage';
// ScrollRestoration import might need react-router-dom v6 setup. Assuming v6.
// Actually ScrollRestoration component is available in v6.4+ data routers or we can implement manual scroll to top.
// For standard BrowserRouter, we can use a wrapper or the component logic.
// I'll stick to simple Routes for now.

import CategoryPage from './pages/CategoryPage';

import FloorIntroPage from './pages/FloorIntroPage';
import FloorGuidePage from './pages/FloorGuidePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import AllProductsPage from './pages/AllProductsPage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import UserListPage from './pages/admin/UserListPage';
import BookingListPage from './pages/admin/BookingListPage';
import MyPage from './pages/MyPage';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Public Store Routes */}
                <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/detail/:id" element={<DetailPage />} />
                    <Route path="/floor/:id" element={<FloorIntroPage />} />
                    <Route path="/floor-guide" element={<FloorGuidePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
                    <Route path="/:category" element={<CategoryPage />} />
                    <Route path="/all-products" element={<AllProductsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                </Route>

                {/* User Routes (Protected but not Admin-only) */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/products/new" element={<ProductFormPage />} />
                    <Route path="/products/:id/edit" element={<ProductFormPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/new" element={<ProductFormPage />} />
                    <Route path="products/:id" element={<ProductFormPage />} />
                    <Route path="users" element={<UserListPage />} />
                    <Route path="bookings" element={<BookingListPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
