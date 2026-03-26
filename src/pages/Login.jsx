import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/store';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import logoImage from '../assets/logo.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    const navigate = useNavigate();

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
        });
    }, []);

    // Hàm kiểm tra tính hợp lệ của dữ liệu nhập vào
    const validateInput = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email không được để trống.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không đúng định dạng.';
        }

        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống.';
        } else if (password.length < 6 || password.length > 15) {
            newErrors.password = 'Mật khẩu phải từ 6-15 kí tự.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Hàm xóa thông báo lỗi khi người dùng nhập lại
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        setGeneralError('');
    };

    // Hàm bật/tắt hiển thị mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Hàm xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setGeneralError('');

        if (!validateInput()) {
            setLoading(false);
            return;
        }

        try {
            const { login } = useAuthStore.getState();
            await login(email, password);

            // Lấy URL chuyển hướng từ localStorage (nếu có)
            const redirectPath = localStorage.getItem('redirectAfterLogin') || '/home';

            // Xóa dữ liệu chuyển hướng
            localStorage.removeItem('redirectAfterLogin');

            // Chuyển hướng người dùng
            navigate(redirectPath);
        } catch (err) {
            console.error('Login error:', err);
            setGeneralError(err?.message || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
            {/* Login Card */}
            <div
                className="w-full max-w-md"
                data-aos="fade-up"
                data-aos-duration="600"
            >
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section with Logo */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-10 text-center">
                        <div className="mb-4" data-aos="zoom-in" data-aos-delay="200">
                            <Logo />
                        </div>
                        <h1 className="text-2xl font-semibold text-white mb-2">Chào mừng trở lại</h1>
                        <p className="text-blue-50 text-sm">Đăng nhập để tiếp tục mua sắm</p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 py-8">
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email Input */}
                            <div data-aos="fade-right" data-aos-delay="300">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onInput={() => clearError('email')}
                                    type="email"
                                    id="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1.5">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div data-aos="fade-right" data-aos-delay="400">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onInput={() => clearError('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800 pr-12"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1.5">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right" data-aos="fade-left" data-aos-delay="500">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            {/* General Error */}
                            {generalError && (
                                <p
                                    className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg"
                                    data-aos="shake"
                                >
                                    {generalError}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
                                data-aos="fade-up"
                                data-aos-delay="600"
                            >
                                {loading && (
                                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                )}
                                <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center" data-aos="fade-up" data-aos-delay="700">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?
                                <Link
                                    to="/register"
                                    className="text-blue-600 font-medium hover:underline ml-1"
                                >
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6" data-aos="fade-up" data-aos-delay="800">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                        &copy; 2025
                        <Link to="/home" className="inline-flex items-center hover:opacity-80 transition-opacity">
                            <img src={logoImage} alt="Logo" className="h-6 w-auto" />
                        </Link>
                        . All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
