import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Trang không tồn tại</p>
                <Link
                    to="/home"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
