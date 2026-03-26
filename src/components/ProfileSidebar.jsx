import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Clock, CreditCard } from 'lucide-react';
import { useAuthStore } from '../stores/store';
import { getProfile } from '../apis/authService';

const ProfileSidebar = () => {
    const authStore = useAuthStore();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const [balance, setBalance] = useState(0);

    // Lấy thông tin người dùng khi component được tạo
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileRes = await getProfile();
                setUserEmail(profileRes.data.email);
                setBalance(profileRes.data.balance);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    // Định dạng số dư theo tiền tệ Việt Nam
    const formattedBalance = new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(balance);

    // Hàm kiểm tra trang hiện tại có đang active hay không
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="h-full bg-white p-4 md:p-6 shadow-md">
            {/* Thông tin người dùng */}
            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg p-4 mb-6">
                <div className="text-white">
                    <p className="text-sm">
                        Xin chào! <span className="font-semibold">{userEmail}</span>
                    </p>
                    <div className="flex justify-between items-center text-sm">
                        <div>
                            <span className="opacity-90">Vai trò:</span>
                            <span className="font-semibold ml-1">Khách hàng</span>
                        </div>
                    </div>
                    <p className="text-xs mt-2 opacity-90">
                        Chúc bạn có một trải nghiệm mua sắm vui vẻ!
                    </p>
                </div>
            </div>

            {/* Menu điều hướng sidebar */}
            <nav className="space-y-3">
                <Link
                    to="/profile"
                    className={`flex items-center justify-between py-3 px-4 border rounded-lg hover:bg-gray-50 transition-colors group ${isActive('/profile') ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Thông tin tài khoản</p>
                            <p className="text-xs text-gray-500">Cập nhật thông tin tài khoản</p>
                        </div>
                    </div>
                    <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>

                <Link
                    to="/payment-history"
                    className={`flex items-center justify-between py-3 px-4 border rounded-lg hover:bg-gray-50 transition-colors group ${isActive('/payment-history') ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Lịch sử giao dịch</p>
                            <p className="text-xs text-gray-500">Tra cứu thông tin vận chuyển</p>
                        </div>
                    </div>
                    <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>

                <Link
                    to="/orders"
                    className={`flex items-center justify-between py-3 px-4 border rounded-lg hover:bg-gray-50 transition-colors group ${isActive('/orders') ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Lịch sử đơn hàng</p>
                            <p className="text-xs text-gray-500">Thông tin hồi viên và lịch sử tích điểm</p>
                        </div>
                    </div>
                    <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </nav>
        </aside>
    );
};

export default ProfileSidebar;
