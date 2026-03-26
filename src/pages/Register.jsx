import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { register } from '../apis/authService';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        address: '',
        phone: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Hàm kiểm tra tính hợp lệ của dữ liệu đăng ký
    const validateInput = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email không được để trống.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không đúng định dạng.';
        }
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống.';
        } else if (formData.password.length < 6 || formData.password.length > 15) {
            newErrors.password = 'Mật khẩu phải từ 6-15 ký tự.';
        }
        if (!formData.fullName) newErrors.fullName = 'Họ tên không được để trống.';
        if (!formData.address) newErrors.address = 'Địa chỉ không được để trống.';
        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại không được để trống.';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Hàm xử lý đăng ký tài khoản
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;

        setLoading(true);
        setGeneralError('');
        try {
            await register(formData.email, formData.password, formData.fullName, formData.address, formData.phone);
            setShowSuccess(true);
            setTimeout(() => navigate('/login'), 1700);
        } catch (error) {
            setGeneralError(error?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xóa thông báo lỗi khi nhập lại
    const clearError = (field) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        setGeneralError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
            {/* Success Alert */}
            {showSuccess && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl border border-green-200 px-6 py-4 flex items-center gap-3 min-w-[320px]">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-gray-900 font-medium">Đăng ký thành công!</p>
                        <p className="text-gray-600 text-sm">Đang chuyển đến trang đăng nhập...</p>
                    </div>
                </div>
            )}

            {/* Register Card */}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-10 text-center">
                        <h1 className="text-2xl font-semibold text-white mb-2">Tạo tài khoản mới</h1>
                        <p className="text-blue-50 text-sm">Đăng ký để bắt đầu mua sắm</p>
                    </div>

                    <div className="px-8 py-8">
                        {generalError && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{generalError}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                                <input type="text" value={formData.fullName} onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); clearError('fullName'); }} placeholder="Nguyễn Văn A" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1.5">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearError('email'); }} placeholder="your@email.com" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearError('password'); }} placeholder="••••••••" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                <input type="tel" value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearError('phone'); }} placeholder="0123456789" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                {errors.phone && <p className="text-red-500 text-sm mt-1.5">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                                <textarea value={formData.address} onChange={(e) => { setFormData({ ...formData, address: e.target.value }); clearError('address'); }} placeholder="Nhập địa chỉ" rows="2" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                {errors.address && <p className="text-red-500 text-sm mt-1.5">{errors.address}</p>}
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Đang xử lý...' : 'Đăng ký'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Đăng nhập</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
