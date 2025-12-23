import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pagination, Empty, Spin } from 'antd';
import { getListProduct } from '../apis/productService';
import ClothingCard from '../components/ClothingCard';
import Filter from '../components/Filter';

const ClothingList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [filters, setFilters] = useState({
        keywords: '',
        majorSelected: null,
        secondMotelSelected: null,
        priceRange: [0, 1000],
        districtSelected: null,
        sizesSelected: [],
        materialsSelected: [],
        colorsSelected: [],
        gender: null,
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [sortOption, setSortOption] = useState('newest_first');

    const sortOptions = [
        { value: 'newest_first', label: 'Hàng mới nhất' },
        { value: 'price_asc', label: 'Giá thấp trước' },
        { value: 'price_desc', label: 'Giá cao trước' },
    ];

    const getSortLabel = () => {
        const option = sortOptions.find((opt) => opt.value === sortOption);
        return option ? option.label : 'Hàng mới nhất';
    };

    const buildQueryParams = (currentFilters = filters) => {
        const params = {};
        params.firstClass = 'QUAN_AO';
        params.del = false;
        params.start = Math.max(pagination.current - 1, 0);
        params.limit = pagination.pageSize;

        if (currentFilters.keywords && currentFilters.keywords.trim() !== '') {
            params.keywords = currentFilters.keywords.trim();
        }

        if (currentFilters.majorSelected) {
            params.majorName = currentFilters.majorSelected;
        }

        if (currentFilters.secondMotelSelected) {
            params.secondMotel = currentFilters.secondMotelSelected;
        }

        if (currentFilters.priceRange && currentFilters.priceRange.length === 2) {
            // Chuyển đổi: 1 = 10k VND, 100 = 1 triệu VND, 1000 = 10 triệu VND
            params.minPrice = currentFilters.priceRange[0] * 10000; // Mười nghìn VND -> VND
            if (currentFilters.priceRange[1] >= 1000) {
                // Không set maxPrice nếu chọn max (10 triệu trở lên)
                // delete params.maxPrice; // không cần vì chưa được set
            } else {
                params.maxPrice = currentFilters.priceRange[1] * 10000;
            }
        }

        if (currentFilters.districtSelected) {
            params.district = currentFilters.districtSelected;
        }

        if (currentFilters.sizesSelected && currentFilters.sizesSelected.length > 0) {
            params.sizes = currentFilters.sizesSelected.join(',');
        }

        if (currentFilters.materialsSelected && currentFilters.materialsSelected.length > 0) {
            params.materials = currentFilters.materialsSelected.join(',');
        }

        if (currentFilters.colorsSelected && currentFilters.colorsSelected.length > 0) {
            params.colors = currentFilters.colorsSelected.join(',');
        }

        if (currentFilters.gender !== null && currentFilters.gender !== undefined) {
            params.gender = currentFilters.gender;
        }

        // Thêm phân loại secondClass đã chọn
        if (currentFilters.secondClassesSelected && currentFilters.secondClassesSelected.length > 0) {
            params.secondClass = currentFilters.secondClassesSelected.join(',');
        }

        // Xử lý sắp xếp
        switch (sortOption) {
            case 'newest_first':
                params.sortField = 'id';
                params.sortType = 'ASC';
                break;
            case 'price_asc':
                params.sortField = 'price';
                params.sortType = 'DESC';
                break;
            case 'price_desc':
                params.sortField = 'price';
                params.sortType = 'ASC';
                break;
            default:
                params.sortField = 'id';
                params.sortType = 'ASC';
        }

        return params;
    };

    const fetchProducts = async (currentFilters = filters) => {
        setLoading(true);
        setErrorMsg('');
        try {
            const queryParams = buildQueryParams(currentFilters);
            console.log('Query params sent to API:', queryParams); // Debug log
            const response = await getListProduct(queryParams);
            const data = response.data;

            if (data && data.items) {
                setProducts(data.items);
                setPagination((prev) => ({
                    ...prev,
                    total: data.total || 0,
                }));
            } else {
                setProducts([]);
                setPagination((prev) => ({
                    ...prev,
                    total: 0,
                }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setErrorMsg('Có lỗi xảy ra khi lấy danh sách bài đăng. Vui lòng kiểm tra lại log!');
        }
        setLoading(false);
    };

    // Khởi tạo dữ liệu khi component được mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, current: page }));
        fetchProducts();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSortChange = (value) => {
        setSortOption(value);
        setShowSortDropdown(false);
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchProducts();
    };

    const handleFilterUpdate = (newFilters) => {
        const updatedFilters = {
            ...filters,
            ...newFilters,
            keywords: filters.keywords,
        };
        setFilters(updatedFilters);
        // Reset về trang 1 khi filter thay đổi
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchProducts(updatedFilters);
    };

    return (
        <div className="bg-white px-4 md:px-6 py-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Link to="/" className="hover:text-gray-900 transition-colors">Trang chủ</Link>
                <span className="text-gray-400">{'>'}</span>
                <span className="text-red-600 font-medium">Quần áo</span>
            </nav>

            {/* Header với tiêu đề và sắp xếp */}
            <div className="flex items-center justify-between mb-6">
                {/* Tiêu đề bên trái */}
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Quần áo
                    </h1>
                    <span className="text-sm text-gray-500 font-normal">{pagination.total} mặt hàng</span>
                </div>

                {/* Nút sắp xếp - bên phải */}
                <div className="flex-shrink-0 relative">
                    {/* Dropdown Button */}
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center space-x-2 px-4 py-3 bg-stone-100 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-200 focus:outline-none min-w-[140px]"
                    >
                        <span className="text-sm font-medium">{getSortLabel()}</span>
                        <svg
                            className={`w-4 h-4 ml-auto transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            ></path>
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showSortDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                            <div className="py-2">
                                <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                                    Sắp xếp theo
                                </div>
                                <div className="py-1">
                                    {sortOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer hover:text-stone-500 ${sortOption === option.value ? 'text-stone-500' : ''
                                                }`}
                                        >
                                            <div className="relative">
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={sortOption === option.value}
                                                    onChange={() => handleSortChange(option.value)}
                                                    className="hidden"
                                                />
                                                <div
                                                    className={`w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center ${sortOption === option.value
                                                        ? 'bg-stone-500 border-stone-500'
                                                        : ''
                                                        }`}
                                                >
                                                    {sortOption === option.value && (
                                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Wrapper toàn trang: hướng cột trên mobile, hướng hàng ngang từ md trở lên */}
            <div className="flex flex-col md:flex-row min-h-screen py-0 md:py-6 bg-white px-4 md:px-6">
                {/* Bộ lọc: chiếm toàn bộ chiều rộng trên mobile, tự động shrink trên desktop */}
                <div className="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
                    <Filter firstClass="QUAN_AO" onFiltersUpdate={handleFilterUpdate} />
                </div>
                {/* Nội dung chính: chiếm phần còn lại */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Overlay để đóng dropdown khi click bên ngoài */}
                    {showSortDropdown && (
                        <div onClick={() => setShowSortDropdown(false)} className="fixed inset-0 z-40"></div>
                    )}

                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMsg && (
                        <div className="p-4 text-red-600">
                            {errorMsg}
                        </div>
                    )}
                    {/* Danh sách tin đăng */}
                    <div className="p-2 pb-20 flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Spin size="large" />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/product/clothing/${product.id}`}
                                            className="block"
                                        >
                                            <ClothingCard product={product} />
                                        </Link>
                                    ))}
                                </div>
                                {/* Phân trang (Ant Design) */}
                                <div className="pt-10 flex justify-center">
                                    <Pagination
                                        current={pagination.current}
                                        pageSize={pagination.pageSize}
                                        total={pagination.total}
                                        showQuickJumper
                                        onChange={handlePageChange}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center font-semibold justify-center py-10">
                                <Empty description="Không tìm thấy tin đăng nào!" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClothingList;
