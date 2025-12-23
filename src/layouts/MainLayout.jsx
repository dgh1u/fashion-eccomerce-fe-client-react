import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="text-2xl font-bold">Fashion Store</div>
                        <div className="flex gap-6">
                            <a href="/home" className="hover:text-blue-500">Trang chủ</a>
                            <a href="/products" className="hover:text-blue-500">Sản phẩm</a>
                            <a href="/contact" className="hover:text-blue-500">Liên hệ</a>
                            <a href="/cart" className="hover:text-blue-500">Giỏ hàng</a>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 Fashion Ecommerce. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
