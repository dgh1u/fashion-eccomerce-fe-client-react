import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SecondaryHeader from '../components/SecondaryHeader';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileSidebar from '../components/ProfileSidebar';

const ProfileLayout = () => {
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const toggleMobileSidebar = () => {
        setShowMobileSidebar(!showMobileSidebar);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Secondary Header */}
            <SecondaryHeader />
            {/* Header */}
            <Header className="bg-gray-300 p-2" />

            {/* Main Content Area with Responsive Grid */}
            <div className="flex flex-col md:grid md:grid-cols-12 min-h-screen bg-white">
                {/* Sidebar - Ẩn trên mobile, hiển thị trên md trở lên */}
                <div className="hidden md:block md:col-span-4 lg:col-span-3">
                    <ProfileSidebar />
                </div>

                {/* Mobile Sidebar Toggle Button - Chỉ hiển thị trên mobile */}
                <div className="md:hidden sticky top-0 z-10 bg-white p-2 shadow-md">
                    <button
                        onClick={toggleMobileSidebar}
                        className="flex items-center justify-between w-full bg-gray-100 p-3 rounded-lg"
                    >
                        <span className="font-medium">Menu trang tài khoản</span>
                        <ChevronDown
                            className={`transition-transform duration-300 ${showMobileSidebar ? 'transform rotate-180' : ''
                                }`}
                            size={20}
                        />
                    </button>

                    {/* Mobile Sidebar - Collapsible */}
                    {showMobileSidebar && (
                        <div className="mt-2 transition-all duration-300 ease-in-out">
                            <ProfileSidebar />
                        </div>
                    )}
                </div>

                {/* Main content */}
                <main className="w-full md:col-span-8 lg:col-span-9 p-4 md:p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <Footer className="bg-gray-300 p-4" />
        </div>
    );
};

export default ProfileLayout;
