import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { regenerateOTP } from '../apis/authService';
import Logo from '../components/Logo';
import logoImage from '../assets/logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Hàm xử lý khi gửi yêu cầu đặt lại mật khẩu
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email không đúng định dạng.');
            setLoading(false);
            return;
        }

        try {
            await regenerateOTP(email);
            navigate('/verify', { state: { email } });
        } catch (err) {
            setError(err?.message || 'Không tìm thấy email.');
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
                            Nhập email để nhận mã xác thực
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="text-right">
                                <a href="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                                    Quay lại đăng nhập
                                </a>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Xác nhận'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?
                                <a href="/register" className="text-blue-600 font-medium hover:underline ml-1">
                                    Đăng ký ngay
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                        &copy; 2025 <a href="/home" className="inline-flex items-center hover:opacity-80 transition-opacity"><img src={logoImage} alt="Logo" className="h-6 w-auto" /></a>. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
