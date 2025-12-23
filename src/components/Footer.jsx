import React from 'react';
import { Facebook, MessageSquare, Mail, Phone, MapPin, Send, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative container mx-auto px-6 py-16">
                {/* Main content grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <div className="brand-logo">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                28.Host
                            </h2>
                            <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Điểm đến hoàn hảo cho phong cách thời trang hiện đại.
                            Chúng tôi mang đến những sản phẩm chất lượng cao với thiết kế độc đáo.
                        </p>
                        {/* Newsletter */}
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold mb-3 text-purple-300">Đăng ký nhận tin</h3>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-l-lg focus:outline-none focus:border-purple-400 text-sm placeholder-gray-400"
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-purple-300">Danh mục</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Quần áo', href: '/product/clothing' },
                                { label: 'Túi xách', href: '/product/bags' },
                                { label: 'Phụ kiện', href: '/product/accessories' },
                                { label: 'Giỏ hàng', href: '/cart' },
                                { label: 'Đơn hàng của tôi', href: '/order-history' }
                            ].map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-purple-300">Chính sách</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Chính sách bảo mật', href: '/privacy-policy#intro' },
                                { label: 'Thu thập dữ liệu', href: '/privacy-policy#data-collection' },
                                { label: 'Bảo mật thông tin', href: '/privacy-policy#data-security' },
                                { label: 'Điều khoản sử dụng', href: '/privacy-policy#data-usage' },
                                { label: 'Tài khoản của tôi', href: '/profile' }
                            ].map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-purple-300">Liên hệ</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start group">
                                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors mr-3">
                                    <Phone className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Điện thoại</div>
                                    <a href="tel:0981266403" className="text-sm text-gray-200 hover:text-purple-400 transition-colors">
                                        +849 1234 5678
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start group">
                                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors mr-3">
                                    <Mail className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Email</div>
                                    <a href="mailto:vantuan@gmail.com" className="text-sm text-gray-200 hover:text-purple-400 transition-colors">
                                        vantuan@gmail.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start group">
                                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors mr-3">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Địa chỉ</div>
                                    <span className="text-sm text-gray-200">36 Trâu Quỳ, Tp Hà Nội</span>
                                </div>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold mb-3 text-purple-300">Kết nối với chúng tôi</h4>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, href: 'https://www.facebook.com/ngao.hieu.16100?locale=vi_VN', color: 'hover:bg-blue-600' },
                                    { icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
                                    { icon: Twitter, href: '#', color: 'hover:bg-sky-600' },
                                    { icon: Mail, href: 'mailto:hieutkhd03@gmail.com', color: 'hover:bg-red-600' }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className={`p-2.5 bg-white/10 backdrop-blur-sm rounded-lg ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-purple-500/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © 2025 <span className="text-purple-400 font-semibold">28.Host</span>. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-xs text-gray-400">
                            <a href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
                            <span>•</span>
                            <a href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</a>
                            <span>•</span>
                            <a href="/sitemap" className="hover:text-purple-400 transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
