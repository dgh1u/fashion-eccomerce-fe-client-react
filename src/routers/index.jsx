import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/store';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DefaultLayout from '../layouts/DefaultLayout';
import HomeLayout from '../layouts/HomeLayout';
import ProfileLayout from '../layouts/ProfileLayout';

// Pages
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const Verify = React.lazy(() => import('../pages/Verify'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));

// Product pages
const ClothingList = React.lazy(() => import('../pages/ClothingList'));
const ClothingDetail = React.lazy(() => import('../pages/ClothingDetail'));
const BagsList = React.lazy(() => import('../pages/BagsList'));
const BagsDetail = React.lazy(() => import('../pages/BagsDetail'));
const AccessoriesList = React.lazy(() => import('../pages/AccessoriesList'));
const AccessoriesDetail = React.lazy(() => import('../pages/AccessoriesDetail'));

// Cart & Checkout
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const PaymentResult = React.lazy(() => import('../pages/PaymentResult'));

// Order & Profile
const OrderHistory = React.lazy(() => import('../pages/OrderHistory'));
const Profile = React.lazy(() => import('../pages/Profile'));
const PaymentHistory = React.lazy(() => import('../pages/PaymentHistory'));

// Other pages
const Contact = React.lazy(() => import('../pages/Contact'));
const Policy = React.lazy(() => import('../pages/Policy'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Guest Route (only for non-authenticated users)
const GuestRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

const AppRouter = () => {
    return (
        <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader"></div>
            </div>
        }>
            <Routes>
                {/* Home with Home Layout */}
                <Route element={<HomeLayout />}>
                    <Route path="/home" element={<Home />} />
                </Route>

                {/* Public Routes with Default Layout */}
                <Route element={<DefaultLayout />}>
                    {/* Product routes */}
                    <Route path="/product/clothing" element={<ClothingList />} />
                    <Route path="/product/clothing/:id" element={<ClothingDetail />} />
                    <Route path="/product/bags" element={<BagsList />} />
                    <Route path="/product/bags/:id" element={<BagsDetail />} />
                    <Route path="/product/accessories" element={<AccessoriesList />} />
                    <Route path="/product/accessories/:id" element={<AccessoriesDetail />} />

                    {/* Other pages */}
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<Policy />} />
                </Route>

                {/* Auth Routes (Guest Only) - No Layout */}
                <Route path="/login" element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute>
                        <Register />
                    </GuestRoute>
                } />
                <Route path="/forgot-password" element={
                    <GuestRoute>
                        <ForgotPassword />
                    </GuestRoute>
                } />
                <Route path="/verify" element={<Verify />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes with Default Layout */}
                <Route element={<DefaultLayout />}>
                    <Route path="/cart" element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    } />
                    <Route path="/payment/:id/result" element={
                        <ProtectedRoute>
                            <PaymentResult />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Profile Routes with Profile Layout */}
                <Route element={<ProfileLayout />}>
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <OrderHistory />
                        </ProtectedRoute>
                    } />
                    <Route path="/payment-history" element={
                        <ProtectedRoute>
                            <PaymentHistory />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </React.Suspense>
    );
};

export default AppRouter;
