import React from 'react';
import { Outlet } from 'react-router-dom';
import SecondaryHeader from '../components/SecondaryHeader';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DefaultLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Secondary Header */}
            <SecondaryHeader />
            {/* Header */}
            <Header className="bg-gray-300 p-2" />

            <main className="px-4 md:px-2 bg-white lg:px-12 xl:px-40">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer className="bg-gray-300 p-4" />
        </div>
    );
};

export default DefaultLayout;
