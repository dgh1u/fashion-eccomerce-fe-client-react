import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/store';
import { Menu, X } from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import CartIcon from './CartIcon';
import Logo from './Logo';

const Header = () => {
    const authStore = useAuthStore();
    const [isSticky, setIsSticky] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Scroll handler for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header
            className={`bg-stone-200 shadow-sm transition-all duration-300 w-full border-b border-stone-200 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : 'relative'
                }`}
        >
            {/* Desktop Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/home" className="flex-shrink-0">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/product/clothing"
                            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                        >
                            Quần áo
                        </Link>
                        <Link
                            to="/product/bags"
                            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                        >
                            Túi xách
                        </Link>
                        <Link
                            to="/product/accessories"
                            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                        >
                            Phụ kiện
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart */}
                        {authStore.isAuthenticated && (
                            <div className="text-gray-900">
                                <CartIcon />
                            </div>
                        )}

                        {/* User Menu or Login */}
                        <div className="relative z-50">
                            {authStore.isAuthenticated ? (
                                <DropdownMenu />
                            ) : (
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                                >
                                    Đăng nhập
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Toggle menu"
                    >
                        {!mobileMenuOpen ? <Menu size={24} /> : <X size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-stone-200 bg-stone-50">
                    <div className="px-4 py-4 space-y-3">
                        {/* Mobile Navigation Links */}
                        <Link
                            to="/product/clothing"
                            onClick={closeMobileMenu}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                        >
                            Quần áo
                        </Link>
                        <Link
                            to="/product/bags"
                            onClick={closeMobileMenu}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                        >
                            Túi xách
                        </Link>
                        <Link
                            to="/product/accessories"
                            onClick={closeMobileMenu}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                        >
                            Phụ kiện
                        </Link>

                        {/* Mobile Divider */}
                        {authStore.isAuthenticated && <div className="border-t border-stone-200 my-3"></div>}

                        {/* Mobile Cart */}
                        {authStore.isAuthenticated && (
                            <div className="px-4 py-2 text-gray-900">
                                <CartIcon />
                            </div>
                        )}

                        {/* Mobile User Actions */}
                        {authStore.isAuthenticated ? (
                            <div className="px-4 py-2 relative z-50">
                                <DropdownMenu isMobile={true} closeMobileMenuFn={closeMobileMenu} />
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                                className="block w-full text-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
