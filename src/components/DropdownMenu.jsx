import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/store';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, CreditCard, Folder, Clock } from 'lucide-react';
import { getProfile } from '../apis/authService';

const DropdownMenu = ({ isMobile = false, closeMobileMenuFn = null }) => {
    const authStore = useAuthStore();
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [profile, setProfile] = useState({
        fullName: '',
        email: ''
    });

    let hideTimeout = null;

    // Hàm lấy thông tin người dùng
    useEffect(() => {
        const fetchProfileData = async () => {
            if (authStore.isAuthenticated && authStore.token) {
                try {
                    const response = await getProfile();
                    console.log('Profile response:', response);
                    setProfile({
                        fullName: response.data.fullName || 'Chưa cập nhật',
                        email: response.data.email || ''
                    });
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin người dùng:', error);
                }
            }
        };

        fetchProfileData();
    }, [authStore.isAuthenticated, authStore.token]);

    const showMenu = () => {
        if (hideTimeout) clearTimeout(hideTimeout);
        setShowDropdown(true);
    };

    const hideMenu = () => {
        hideTimeout = setTimeout(() => {
            setShowDropdown(false);
        }, 200);
    };

    const handleLogout = () => {
        authStore.logout();
        navigate('/login');
        if (closeMobileMenuFn) closeMobileMenuFn();
    };

    const closeMobileMenuIfNeeded = () => {
        if (closeMobileMenuFn) closeMobileMenuFn();
    };

    return (
        <div
            className="relative"
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
        >
            {/* Desktop Dropdown Trigger Button */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50 rounded transition-colors">
                <User size={18} className="text-gray-700" />
                <span className="text-sm text-gray-700">Tài khoản</span>
            </div>

            {/* Mobile Menu */}
            {isMobile && (
                <div className="px-3 py-2">
                    {/* Mobile User Info */}
                    <div className="mb-3 pb-3 border-b border-gray-100">
                        <div className="text-sm font-medium truncate">{profile.fullName}</div>
                        <div className="text-xs text-gray-500 truncate">{profile.email}</div>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="space-y-1">
                        <a
                            href="/profile"
                            className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded px-2 transition-colors"
                            onClick={closeMobileMenuIfNeeded}
                        >
                            <User size={16} />
                            <span>Thông tin tài khoản</span>
                        </a>
                        <a
                            href="/my-products"
                            className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded px-2 transition-colors"
                            onClick={closeMobileMenuIfNeeded}
                        >
                            <Folder size={16} />
                            <span>Danh sách tin đăng</span>
                        </a>
                        <a
                            href="/orders"
                            className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded px-2 transition-colors"
                            onClick={closeMobileMenuIfNeeded}
                        >
                            <ShoppingBag size={16} />
                            <span>Lịch sử đơn hàng</span>
                        </a>
                        <div className="border-t border-gray-100 my-2"></div>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}
                            className="flex items-center gap-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded px-2 transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Đăng xuất</span>
                        </a>
                    </div>
                </div>
            )}

            {/* Desktop Dropdown Content */}
            {showDropdown && !isMobile && (
                <div
                    className="absolute right-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-sm"
                    style={{ zIndex: 9999 }}
                    onMouseEnter={showMenu}
                    onMouseLeave={hideMenu}
                >
                    {/* Khu vực thông tin người dùng */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {profile.fullName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{profile.email}</div>
                    </div>

                    {/* Danh sách tùy chọn */}
                    <div className="py-1">
                        <a
                            href="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <User size={16} />
                            <span>Thông tin tài khoản</span>
                        </a>
                        <a
                            href="/payment-history"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <CreditCard size={16} />
                            <span>Lịch sử giao dịch</span>
                        </a>
                        <a
                            href="/orders"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Clock size={16} />
                            <span>Lịch sử đơn hàng</span>
                        </a>
                    </div>

                    {/* Thanh ngăn cách */}
                    <div className="border-t border-gray-100"></div>

                    <div className="py-1">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Đăng xuất</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
