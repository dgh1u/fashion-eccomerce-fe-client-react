import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { ShoppingCart } from 'lucide-react';
import { getDetailProduct, getListProduct } from '../apis/productService';
import { getImageByProduct } from '../apis/imageService';
import ClothingCard from '../components/ClothingCard';
import { useAuthStore } from '../stores/store';
import { useCartStore } from '../stores/store';
import sizeGuideImage from '../assets/size.jpg';

// Color configuration matching Vue colorSets
const colorSets = {
    fashion: [
        { value: 'red', label: 'Đỏ', color: '#EF4444' },
        { value: 'blue', label: 'Xanh dương', color: '#3B82F6' },
        { value: 'green', label: 'Xanh lá', color: '#10B981' },
        { value: 'yellow', label: 'Vàng', color: '#F59E0B' },
        { value: 'black', label: 'Đen', color: '#000000' },
        { value: 'white', label: 'Trắng', color: '#FFFFFF' },
        { value: 'gray', label: 'Xám', color: '#6B7280' },
        { value: 'pink', label: 'Hồng', color: '#EC4899' },
        { value: 'purple', label: 'Tím', color: '#8B5CF6' },
        { value: 'orange', label: 'Cam', color: '#F97316' },
        { value: 'brown', label: 'Nâu', color: '#92400E' },
        { value: 'beige', label: 'Be', color: '#D4B5A0' },
    ]
};

const Color = ({ color }) => {
    if (!color) return null;

    return (
        <div className="flex items-center gap-2">
            <div
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};

const AccessoriesDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    // Computed values
    const currentImage = useMemo(() => {
        return imageUrls.length > 0
            ? imageUrls[currentImageIndex]
            : 'https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image';
    }, [imageUrls, currentImageIndex]);

    const productColor = useMemo(() => {
        if (!product?.criteriaDTO?.color) return null;

        const colorValue = product.criteriaDTO.color.toLowerCase();
        const colorSet = colorSets.fashion;

        const foundColor = colorSet.find(
            (color) =>
                color.value.toLowerCase() === colorValue ||
                color.label.toLowerCase() === colorValue ||
                color.label.toLowerCase().includes(colorValue) ||
                colorValue.includes(color.label.toLowerCase())
        );

        return foundColor;
    }, [product]);

    const discountPercentage = useMemo(() => {
        if (!product?.criteriaDTO) return 0;

        const originalPrice = parseFloat(product.criteriaDTO.originalPrice) || 0;
        const currentPrice = parseFloat(product.criteriaDTO.price) || 0;

        if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
            return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
        }
        return 0;
    }, [product]);

    const hasValidDiscount = useMemo(() => {
        if (!product?.criteriaDTO) return false;

        const originalPrice = parseFloat(product.criteriaDTO.originalPrice) || 0;
        const currentPrice = parseFloat(product.criteriaDTO.price) || 0;

        return originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice;
    }, [product]);

    // Image gallery functions
    const selectImage = (index) => {
        setCurrentImageIndex(index);
    };

    const nextImage = () => {
        if (currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const previousImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleImageError = (e) => {
        e.target.src = 'https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image';
    };

    const handleThumbnailError = (e) => {
        e.target.src = 'https://dummyimage.com/200x200/cccccc/000000.png&text=Error';
    };

    // Load gallery images
    const loadGalleryImages = async (productId) => {
        try {
            const urls = await getImageByProduct(productId);
            if (Array.isArray(urls) && urls.length > 0) {
                setImageUrls(urls);
                setCurrentImageIndex(0);
            } else {
                setImageUrls(['https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image']);
                setCurrentImageIndex(0);
            }
        } catch (err) {
            console.error('Error loading gallery images:', err);
            setImageUrls(['https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image']);
            setCurrentImageIndex(0);
        }
    };

    // Fetch product details
    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await getDetailProduct(id);
            const result = response.data;

            console.log('📦 Product data:', result);
            console.log('📏 Inventories:', result.inventories);

            setProduct(result);
            await loadGalleryImages(result.id);

            // Auto-select first available size
            if (result.inventories && result.inventories.length > 0) {
                const firstAvailableInventory = result.inventories.find(
                    (inv) => inv.quantity > 0
                );
                if (firstAvailableInventory) {
                    handleSelectSize(firstAvailableInventory.size, firstAvailableInventory.quantity);
                }
            } else {
                console.warn('⚠️ Không có dữ liệu inventories!');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setErrorMsg('Có lỗi khi tải bài đăng');
        } finally {
            setLoading(false);
        }
    };

    // Fetch related products
    const fetchRelatedProducts = async () => {
        if (!product) return;

        try {
            const response = await getListProduct({
                firstClass: 'PHU_KIEN',
                del: false,
                start: 0,
                limit: 20,
                sortField: 'id',
                sortType: 'ASC',
            });

            if (response.data && response.data.items) {
                const filteredProducts = response.data.items.filter((p) => p.id !== product.id);
                const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
                setRelatedProducts(shuffled.slice(0, 4));
            }
        } catch (error) {
            console.error('Error fetching related products:', error);
            setRelatedProducts([]);
        }
    };

    // Size and quantity management
    const getAvailableQuantity = (sizeId) => {
        const inventory = product?.inventories?.find((inv) => inv.size.id === sizeId);
        return inventory?.quantity || 0;
    };

    const getMaxQuantity = () => {
        if (!selectedSize) return 0;
        return getAvailableQuantity(selectedSize.id);
    };

    const handleSelectSize = (size, availableQuantity) => {
        if (availableQuantity > 0) {
            setSelectedSize(size);
            setQuantity(1);
        }
    };

    const increaseQuantity = () => {
        const maxQty = getMaxQuantity();
        if (quantity < maxQty) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const validateQuantity = (e) => {
        const value = parseInt(e.target.value);
        const maxQty = getMaxQuantity();
        if (isNaN(value) || value < 1) {
            setQuantity(1);
        } else if (value > maxQty) {
            setQuantity(maxQty);
        } else {
            setQuantity(value);
        }
    };

    // Cart operations
    const addToCart = async () => {
        if (!authStore.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            message.warning('Vui lòng chọn kích thước');
            return;
        }

        if (quantity <= 0 || quantity > getMaxQuantity()) {
            message.warning('Số lượng không hợp lệ');
            return;
        }

        try {
            await cartStore.addToCart(product.id, selectedSize.id, quantity);
            message.success(`Đã thêm ${quantity} sản phẩm size ${selectedSize.name} vào giỏ hàng`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            message.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
        }
    };

    const buyNow = async () => {
        if (!authStore.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để mua sản phẩm');
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            message.warning('Vui lòng chọn kích thước');
            return;
        }

        if (quantity <= 0 || quantity > getMaxQuantity()) {
            message.warning('Số lượng không hợp lệ');
            return;
        }

        try {
            await cartStore.addToCart(product.id, selectedSize.id, quantity);
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            message.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
        }
    };

    // Effects
    useEffect(() => {
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            fetchRelatedProducts();
        }
    }, [product]);

    // Reset on ID change
    useEffect(() => {
        setCurrentImageIndex(0);
        setSelectedSize(null);
        setQuantity(1);
        setRelatedProducts([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <p className="text-gray-500">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <p className="text-red-500">{errorMsg}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <p className="text-gray-500">Không tìm thấy sản phẩm</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Breadcrumb */}
            <div className="pt-4 px-6">
                <div className="text-sm flex items-center flex-wrap space-x-1">
                    <Link to="/product/accessories" className="hover:underline font-medium text-gray-400">
                        Phụ kiện
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="font-semibold text-black">{product.title}</span>
                </div>
            </div>

            {/* Main container */}
            <div className="flex flex-col min-h-screen">
                <div className="flex flex-col lg:flex-row flex-1">
                    {/* Left column - Image Gallery */}
                    <div className="w-full lg:w-140 mx-auto mr-10 p-4 bg-white">
                        <div className="rounded-xl my-6">
                            <div className="flex gap-4">
                                {/* Thumbnail Gallery */}
                                {imageUrls.length > 1 && (
                                    <div className="flex flex-col gap-2 overflow-y-auto max-h-96">
                                        {imageUrls.map((imageUrl, index) => (
                                            <div
                                                key={index}
                                                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${currentImageIndex === index
                                                    ? 'border-sky-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => selectImage(index)}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt="Thumbnail"
                                                    className="w-full h-full object-cover"
                                                    onError={handleThumbnailError}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Main Image Display */}
                                <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden">
                                    <img
                                        src={currentImage}
                                        alt="Accessory Image"
                                        className="w-full h-full object-cover transition-all duration-300"
                                        onError={handleImageError}
                                    />

                                    {/* Navigation arrows */}
                                    {imageUrls.length > 1 && (
                                        <div className="absolute inset-0 flex items-center justify-between p-2">
                                            <button
                                                onClick={previousImage}
                                                className="bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
                                                disabled={currentImageIndex === 0}
                                                style={{
                                                    opacity: currentImageIndex === 0 ? 0.5 : 1,
                                                    cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 19l-7-7 7-7"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
                                                disabled={currentImageIndex === imageUrls.length - 1}
                                                style={{
                                                    opacity: currentImageIndex === imageUrls.length - 1 ? 0.5 : 1,
                                                    cursor: currentImageIndex === imageUrls.length - 1 ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Image counter */}
                                    {imageUrls.length > 1 && (
                                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm">
                                            {currentImageIndex + 1} / {imageUrls.length}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Details */}
                    <div className="flex-1 p-4 bg-white order-1 lg:order-2">
                        <div className="rounded-xl p-4 text-left">
                            <div>
                                <span className="text-xl sm:text-3xl font-bold">{product.title}</span>

                                <div className="flex flex-col sm:flex-row sm:justify-between text-sm my-2 gap-2">
                                    <div className="flex items-center flex-wrap">
                                        <span className="text-sm font-medium">
                                            Mã sản phẩm:<span className="ml-1 text-gray-400">{product.id}</span>
                                        </span>
                                    </div>
                                </div>

                                <hr className="my-3 mx-2 sm:mx-6 border-gray-100" />

                                <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4 mt-2">
                                    <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                                        <div className="flex flex-col">
                                            {/* Original price if discount */}
                                            {hasValidDiscount && (
                                                <div className="text-gray-400 line-through font-semibold text-lg">
                                                    {new Intl.NumberFormat('vi-VN').format(product.criteriaDTO.originalPrice)}đ
                                                </div>
                                            )}

                                            {/* Current price and discount badge */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-black">
                                                    {new Intl.NumberFormat('vi-VN').format(product.criteriaDTO.price)}đ
                                                </span>
                                                {hasValidDiscount && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
                                                        -{discountPercentage}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Add to cart section */}
                                <div className="mt-6">
                                    {/* Size selection */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-base">Kích thước:</span>
                                                <span className="text-black font-semibold text-base">
                                                    {selectedSize?.name || 'Chưa chọn'}
                                                </span>
                                                {selectedSize && (
                                                    <span className="text-gray-500 text-sm">
                                                        (Còn {getAvailableQuantity(selectedSize.id)} sản phẩm)
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setShowSizeGuide(true)}
                                                className="text-blue-600 text-xs font-medium hover:underline cursor-pointer bg-transparent border-none p-0"
                                            >
                                                Hướng dẫn chọn size
                                            </button>
                                        </div>

                                        {/* Size buttons */}
                                        <div className="flex gap-3 mt-3">
                                            {product.inventories?.map((inventory) => (
                                                <button
                                                    key={inventory.size.id}
                                                    className={`min-w-[70px] h-12 px-3 rounded-xl flex items-center justify-center transition-all duration-200 font-medium text-base relative ${selectedSize?.id === inventory.size.id
                                                        ? 'bg-black !text-white border-2 border-black'
                                                        : inventory.quantity > 0
                                                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-transparent hover:border-gray-400'
                                                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed relative'
                                                        }`}
                                                    disabled={inventory.quantity === 0}
                                                    onClick={() => handleSelectSize(inventory.size, inventory.quantity)}
                                                >
                                                    {inventory.size.name}
                                                    {inventory.quantity === 0 && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-full h-0.5 bg-gray-400 transform rotate-45 absolute"></div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="font-medium py-2 text-base">
                                        Chất liệu chính:<span className="ml-1 text-gray-400">{product.criteriaDTO.material}</span>
                                    </div>

                                    <div className="font-medium text-base">
                                        Màu sắc:<span className="ml-1 text-gray-400">{product.criteriaDTO.color}</span>
                                        {productColor && (
                                            <div className="mt-2">
                                                <Color color={productColor.color} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity and buttons */}
                                    <div className="flex flex-col gap-3 pt-8">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center bg-gray-100 rounded-2xl font-medium">
                                                <button
                                                    className="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-200 rounded-l transition-colors"
                                                    disabled={quantity <= 1 || !selectedSize}
                                                    onClick={decreaseQuantity}
                                                    style={{
                                                        opacity: quantity <= 1 || !selectedSize ? 0.5 : 1,
                                                        cursor: quantity <= 1 || !selectedSize ? 'not-allowed' : 'pointer',
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={validateQuantity}
                                                    className="w-12 h-10 bg-gray-100 text-center focus:outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    min="1"
                                                    max={getMaxQuantity()}
                                                    disabled={!selectedSize}
                                                />
                                                <button
                                                    className="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-200 rounded-r transition-colors"
                                                    disabled={!selectedSize || quantity >= getMaxQuantity()}
                                                    onClick={increaseQuantity}
                                                    style={{
                                                        opacity: !selectedSize || quantity >= getMaxQuantity() ? 0.5 : 1,
                                                        cursor: !selectedSize || quantity >= getMaxQuantity() ? 'not-allowed' : 'pointer',
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-lg font-semibold">
                                                    {new Intl.NumberFormat('vi-VN').format(product.criteriaDTO.price * quantity)}đ
                                                </div>
                                            </div>
                                        </div>

                                        <div className="font-medium pt-2 text-lg">
                                            <button
                                                className={`w-full py-3 transition-colors rounded-xl flex items-center justify-center gap-2 ${selectedSize && quantity > 0 && quantity <= getMaxQuantity()
                                                    ? 'bg-white hover:bg-stone-300 border border-stone-600 border-2'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                    }`}
                                                disabled={!selectedSize || quantity <= 0 || quantity > getMaxQuantity()}
                                                onClick={addToCart}
                                            >
                                                <ShoppingCart /> Thêm vào Giỏ hàng
                                            </button>
                                        </div>

                                        <div className="text-white font-medium text-lg">
                                            <button
                                                className={`w-full py-3 transition-colors rounded-xl ${selectedSize && quantity > 0 && quantity <= getMaxQuantity()
                                                    ? 'bg-stone-600 hover:bg-stone-900'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                    }`}
                                                disabled={!selectedSize || quantity <= 0 || quantity > getMaxQuantity()}
                                                onClick={buyNow}
                                            >
                                                Mua ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="w-full bg-white p-8">
                    <div className="border-b-2 border-blue-500 inline-block">
                        <span className="text-lg font-semibold">Mô tả</span>
                    </div>
                    <span className="block py-2 break-words text-sm sm:text-base">{product?.content}</span>
                </div>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <div className="w-full bg-white p-8">
                        <div className="border-b-2 border-blue-500 inline-block mb-6">
                            <span className="text-lg font-semibold">Sản phẩm liên quan mới nhất</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((relatedProduct) => (
                                <Link key={relatedProduct.id} to={`/product/accessories/${relatedProduct.id}`} className="block">
                                    <ClothingCard product={relatedProduct} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Size Guide Popup */}
            {showSizeGuide && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowSizeGuide(false)}
                >
                    <div
                        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowSizeGuide(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-10"
                        >
                            ×
                        </button>
                        <img
                            src={sizeGuideImage}
                            alt="Hướng dẫn chọn size"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessoriesDetail;
