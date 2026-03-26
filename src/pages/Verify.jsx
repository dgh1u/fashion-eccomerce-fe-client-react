import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyAccount, regenerateOTP } from '../apis/authService';
import Logo from '../components/Logo';

const Verify = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    // Hàm xử lý xác thực OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!otp || otp.length < 6) {
            setError('Mã OTP phải có 6 ký tự.');
            setLoading(false);
            return;
        }

        try {
            await verifyAccount(email, otp);
            setSuccess('Xác thực thành công!');
            setTimeout(() => {
                navigate('/reset-password', { state: { email, otp } });
            }, 1000);
        } catch (err) {
            setError(err?.message || 'Mã OTP không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý gửi lại mã OTP
    const handleResendOTP = async () => {
        if (!canResend) return;

        setResendLoading(true);
        setError('');
        setSuccess('');

        try {
            await regenerateOTP(email);
            setSuccess('Mã OTP mới đã được gửi đến email của bạn!');
            setCanResend(false);
            setCountdown(60);
        } catch (err) {
            setError(err?.message || 'Không thể gửi lại mã OTP.');
        } finally {
            setResendLoading(false);
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
                            Xác thực OTP
                        </h1>
                        <p className="text-blue-50 text-sm">
                            Nhập mã OTP đã gửi đến email {email}
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    placeholder="123456"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-2xl tracking-widest"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="text-green-500 text-sm text-center bg-green-50 py-2 px-4 rounded-lg">
                                    {success}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xác thực...' : 'Xác nhận'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={!canResend || resendLoading}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {resendLoading ? 'Đang gửi...' :
                                        canResend ? 'Gửi lại mã OTP' :
                                            `Gửi lại sau ${countdown}s`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
