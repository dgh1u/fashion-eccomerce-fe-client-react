import React, { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile } from '../apis/authService';
import { message } from 'antd';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const initialProfileData = useRef({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                const { email, fullName, phone, address } = response.data;
                const data = { email, fullName, phone, address: address || '' };
                setProfileData(data);
                initialProfileData.current = { ...data };
            } catch (error) {
                message.error('Lỗi khi lấy thông tin tài khoản!');
                console.error('Lỗi khi lấy thông tin profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Hàm bắt đầu chế độ chỉnh sửa thông tin
    const startEditing = () => {
        setIsEditing(true);
    };

    // Hàm hủy chỉnh sửa và khôi phục dữ liệu ban đầu
    const cancelEditing = () => {
        setProfileData({ ...initialProfileData.current });
        setIsEditing(false);
    };

    // Hàm xử lý cập nhật thông tin tài khoản
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileData);
            message.success('Cập nhật thông tin thành công!');
            initialProfileData.current = { ...profileData };
            setIsEditing(false);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Cập nhật thất bại!';
            message.error(errorMsg);
            console.error('Lỗi khi cập nhật profile:', error);
        }
    };

    // Hàm xử lý thay đổi giá trị input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <>
            {/* Tiêu đề */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide">
                    Thông tin tài khoản
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    Cập nhật thông tin cá nhân để hoàn tất quy trình trên hệ thống của chúng tôi.
                </p>
            </div>

            {/* Nội dung thông tin */}
            {!isEditing ? (
                <div className="max-w-2xl">
                    <div className="space-y-4">
                        {/* Họ và tên */}
                        <div className="flex py-3 border-b border-gray-200">
                            <span className="text-gray-600 w-40 flex-shrink-0">Họ và tên</span>
                            <span className="text-gray-800 font-medium">{profileData.fullName || '-'}</span>
                        </div>

                        {/* Số điện thoại */}
                        <div className="flex py-3 border-b border-gray-200">
                            <span className="text-gray-600 w-40 flex-shrink-0">Số điện thoại</span>
                            <span className="text-gray-800 font-medium">{profileData.phone || '-'}</span>
                        </div>

                        {/* Email */}
                        <div className="flex py-3 border-b border-gray-200">
                            <span className="text-gray-600 w-40 flex-shrink-0">Email</span>
                            <span className="text-gray-800 font-medium">{profileData.email || '-'}</span>
                        </div>

                        {/* Địa chỉ */}
                        <div className="flex py-3 border-b border-gray-200">
                            <span className="text-gray-600 w-40 flex-shrink-0">Địa chỉ</span>
                            <span className="text-gray-800 font-medium">{profileData.address || '-'}</span>
                        </div>
                    </div>

                    {/* Ghi chú */}
                    <div className="my-6 bg-gray-50 p-4 rounded-lg">
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Vui lòng liên hệ hộ tổng đài <strong>CSKH 1800 6061 dt</strong> được hỗ trợ thêm.</li>
                        </ul>
                    </div>

                    {/* Nút sửa thông tin */}
                    <button
                        onClick={startEditing}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-gray-800 text-gray-800 font-medium rounded hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa thông tin
                    </button>
                </div>
            ) : (
                /* Form chỉnh sửa */
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Họ và tên */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={profileData.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:border-gray-800"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:border-gray-800"
                            />
                        </div>

                        {/* Email (disabled) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                disabled
                                className="w-full border border-gray-200 px-4 py-2.5 rounded bg-gray-50 text-gray-500"
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={profileData.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:border-gray-800"
                            />
                        </div>

                        {/* Nút hành động */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gray-800 text-white font-medium rounded hover:bg-gray-900 transition-colors"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Profile;
