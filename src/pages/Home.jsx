import React from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import {
    Shirt,
    ShoppingBag,
    Watch,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Shield,
    Truck
} from 'lucide-react';
import quanAoImg from '../assets/home-page/quan-ao.jpg';
import tuiXachImg from '../assets/home-page/tui-xach.jpeg';
import phuKienImg from '../assets/home-page/phu-kien.jpg';
import logo1 from '../assets/marquee-items/logo1.svg';
import logo2 from '../assets/marquee-items/logo2.svg';
import logo3 from '../assets/marquee-items/logo3.svg';
import logo4 from '../assets/marquee-items/logo4.svg';
import logo5 from '../assets/marquee-items/logo5.svg';

const Home = () => {
    const imgArray = [logo1, logo2, logo3, logo4, logo5];

    const features = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Sản phẩm chính hãng",
            description: "100% sản phẩm chính hãng, đảm bảo chất lượng"
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Giao hàng nhanh",
            description: "Giao hàng toàn quốc, nhận hàng trong 2-3 ngày"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Xu hướng mới nhất",
            description: "Cập nhật xu hướng thời trang mới nhất"
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "Chất lượng cao",
            description: "Sản phẩm được tuyển chọn kỹ lưỡng"
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Khám phá thời trang hiện đại</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Thời Trang <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Đẳng Cấp</span>
                            <br />Cho Phong Cách Của Bạn
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Khám phá bộ sưu tập thời trang cao cấp với hàng ngàn sản phẩm từ quần áo, túi xách đến phụ kiện thời trang
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/product/clothing"
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center group"
                            >
                                Mua sắm ngay
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/product/accessories"
                                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Khám phá bộ sưu tập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Danh Mục Sản Phẩm
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Khám phá bộ sưu tập đa dạng với hàng ngàn sản phẩm thời trang cao cấp
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Quần áo Card */}
                        <Link
                            to="/product/clothing"
                            className="group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                            data-aos="zoom-in"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={quanAoImg}
                                    alt="Quần áo"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 text-white mb-2">
                                        <Shirt className="w-6 h-6" />
                                        <h3 className="font-bold text-2xl">Quần Áo</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Bộ sưu tập thời trang nam nữ hiện đại, phong cách đa dạng từ công sở đến dạo phố
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-purple-600">100+ sản phẩm</span>
                                    <div className="flex items-center gap-2 text-purple-600 font-medium group-hover:gap-3 transition-all">
                                        Xem ngay
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Túi xách Card */}
                        <Link
                            to="/product/bags"
                            className="group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                            data-aos="zoom-in"
                            data-aos-delay="100"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={tuiXachImg}
                                    alt="Túi xách"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 text-white mb-2">
                                        <ShoppingBag className="w-6 h-6" />
                                        <h3 className="font-bold text-2xl">Túi Xách</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Bộ sưu tập túi xách cao cấp, thiết kế tinh tế phù hợp mọi phong cách
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-pink-600">50+ sản phẩm</span>
                                    <div className="flex items-center gap-2 text-pink-600 font-medium group-hover:gap-3 transition-all">
                                        Xem ngay
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Phụ kiện Card */}
                        <Link
                            to="/product/accessories"
                            className="group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                            data-aos="zoom-in"
                            data-aos-delay="200"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={phuKienImg}
                                    alt="Phụ kiện"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 text-white mb-2">
                                        <Watch className="w-6 h-6" />
                                        <h3 className="font-bold text-2xl">Phụ Kiện</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Phụ kiện thời trang hoàn thiện phong cách: đồng hồ, kính mát, thắt lưng,...
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-blue-600">60+ sản phẩm</span>
                                    <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                                        Xem ngay
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Brand Partners Section */}
            <div className="py-20 bg-white" data-aos="fade-up">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Thương Hiệu Đồng Hành
                        </h2>
                        <p className="text-gray-600">
                            Đối tác tin cậy của các thương hiệu thời trang hàng đầu
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
                        <Marquee direction="right" speed={40} gradient={false}>
                            {imgArray.map((img, index) => (
                                <div key={index} className="mx-12 flex items-center justify-center">
                                    <img
                                        src={img}
                                        alt={`Brand ${index + 1}`}
                                        className="h-16 w-auto opacity-70 hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-4xl font-bold mb-6">
                            Sẵn Sàng Khám Phá Phong Cách Của Bạn?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Tham gia cùng hàng ngàn khách hàng đã tin tưởng và lựa chọn chúng tôi
                        </p>
                        <Link
                            to="/product/clothing"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Bắt đầu mua sắm
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
