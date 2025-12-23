import React from 'react';
import { Outlet } from 'react-router-dom';
import SecondaryHeader from '../components/SecondaryHeader';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomeLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Secondary Header */}
            <SecondaryHeader />
            {/* Header */}
            <Header className="bg-gray-300 p-2" />

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-14 gap-4 bg-white">
                {/* Sidebar Left */}
                <div className="col-span-1 bg-white text-center"></div>

                {/* Main Content */}
                <main className="col-span-12 bg-white p-4 text-center">
                    <Outlet />
                </main>

                {/* Sidebar Right */}
                <div className="col-span-1 bg-white text-center"></div>
            </div>

            {/* Footer */}
            <Footer className="bg-gray-300 p-4" />
        </div>
    );
};

export default HomeLayout;
