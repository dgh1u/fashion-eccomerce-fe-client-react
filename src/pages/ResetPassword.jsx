import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { forgotPassword } from '../apis/authService';
import Logo from '../components/Logo';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Mật khẩu phải có ít nhất 8 ký tự.';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất 1 chữ thường.';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất 1 chữ hoa.';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất 1 số.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate password
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }

        try {
            await forgotPassword(email, newPassword, otp);
            alert('Đặt lại mật khẩu thành công!');
            navigate('/login');
        } catch (err) {
            setError(err?.message || 'Không thể đặt lại mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-10 text-center">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <h1 className="text-2xl font-semibold text-white mb-2">
                            Đặt lại mật khẩu
                        </h1>
                        <p className="text-blue-50 text-sm">
                            Nhập mật khẩu mới cho tài khoản {email}
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Nhập mật khẩu mới"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Nhập lại mật khẩu mới"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                                >
                                    Quay lại đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
