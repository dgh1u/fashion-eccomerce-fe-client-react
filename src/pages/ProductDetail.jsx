import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { message } from 'antd';
import { ShoppingCart } from 'lucide-react';
import { getDetailProduct } from '../apis/productService';
import { getImageByProduct } from '../apis/imageService';
import { useCartStore } from '../stores/store';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const cartStore = useCartStore();

    const [product, setProduct] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const placeholder = 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image';

    const discountPercentage = useMemo(() => {
        if (!product) return 0;
        const originalPrice = parseFloat(product.criteriaDTO?.originalPrice) || 0;
        const currentPrice = parseFloat(product.criteriaDTO?.price) || 0;
        if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
            return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
        }
        return 0;
    }, [product]);

    const hasValidDiscount = useMemo(() => {
        if (!product) return false;
        const originalPrice = parseFloat(product.criteriaDTO?.originalPrice) || 0;
        const currentPrice = parseFloat(product.criteriaDTO?.price) || 0;
        return originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice;
    }, [product]);

    const currentImage = useMemo(() => imageUrls[currentImageIndex] || placeholder, [imageUrls, currentImageIndex]);
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

    const getAvailableQuantity = (sizeId) => {
        if (!product?.inventories) return 0;
        const inventory = product.inventories.find((inv) => inv.size.id === sizeId);
        return inventory?.quantity || 0;
    };

    const getMaxQuantity = () => selectedSize ? getAvailableQuantity(selectedSize.id) : 0;

    const selectSize = (size, availableQty) => {
        if (availableQty === 0) return;
        setSelectedSize(size);
        setQuantity(1);
    };

    const addToCart = async () => {
        if (!selectedSize) return message.warning('Vui lòng chọn kích thước');
        try {
            await cartStore.addToCart(product.id, selectedSize.id, quantity);
            message.success('Đã thêm vào giỏ hàng');
        } catch { message.error('Thêm vào giỏ hàng thất bại'); }
    };

    const buyNow = async () => {
        if (!selectedSize) return message.warning('Vui lòng chọn kích thước');
        try {
            await cartStore.addToCart(product.id, selectedSize.id, quantity);
            navigate('/checkout');
        } catch { message.error('Có lỗi xảy ra'); }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productData = await getDetailProduct(id);
                setProduct(productData);
                const images = await getImageByProduct(id);
                setImageUrls(Array.isArray(images) && images.length > 0 ? images : [placeholder]);
            } catch (error) {
                console.error('Error:', error);
                message.error('Không thể tải thông tin sản phẩm');
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sản phẩm</div>;

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-4 px-6">
                <div className="text-sm flex items-center space-x-1">
                    <Link to="/clothing" className="hover:underline font-medium text-gray-400">Quần áo</Link>
                    <span className="text-gray-400">/</span>
                    <span className="font-semibold text-black">{product.title}</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Image Gallery */}
                <div className="w-full lg:w-[560px] mx-auto p-4">
                    <div className="rounded-xl my-6">
                        <div className="flex gap-4">
                            {imageUrls.length > 1 && (
                                <div className="flex flex-col gap-2 overflow-y-auto max-h-96">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-sky-500' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setCurrentImageIndex(index)}>
                                            <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden">
                                <img src={currentImage} alt="Product" className="w-full h-full object-cover" />
                                {imageUrls.length > 1 && (
                                    <>
                                        <button onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))} disabled={currentImageIndex === 0} className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 ${currentImageIndex === 0 ? 'opacity-50' : 'hover:bg-opacity-70'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button onClick={() => setCurrentImageIndex(Math.min(imageUrls.length - 1, currentImageIndex + 1))} disabled={currentImageIndex === imageUrls.length - 1} className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 ${currentImageIndex === imageUrls.length - 1 ? 'opacity-50' : 'hover:bg-opacity-70'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm">{currentImageIndex + 1} / {imageUrls.length}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 p-4">
                    <div className="rounded-xl p-4">
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <div className="text-sm my-2">Mã: <span className="text-gray-400">{product.id}</span></div>
                        <hr className="my-3" />
                        <div className="flex items-center gap-4 mt-2">
                            <div>
                                {hasValidDiscount && <div className="text-gray-400 line-through text-lg">{formatPrice(product.criteriaDTO.originalPrice)}đ</div>}
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold">{formatPrice(product.criteriaDTO.price)}đ</span>
                                    {hasValidDiscount && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded">-{discountPercentage}%</span>}
                                </div>
                            </div>
                        </div>

                        {/* Size */}
                        <div className="mt-6">
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="font-medium">Kích thước:</span>
                                    <span className="font-semibold">{selectedSize?.name || 'Chưa chọn'}</span>
                                    {selectedSize && <span className="text-sm text-gray-500">(Còn {getAvailableQuantity(selectedSize.id)} sp)</span>}
                                </div>
                                <div className="flex gap-3">
                                    {product.inventories?.map((inv) => (
                                        <button key={inv.size.id} onClick={() => selectSize(inv.size, inv.quantity)} disabled={inv.quantity === 0} className={`min-w-[70px] h-12 px-3 rounded-xl font-medium relative ${selectedSize?.id === inv.size.id ? 'bg-black text-white border-2' : inv.quantity > 0 ? 'bg-gray-200 hover:bg-gray-300 border-2' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                            {inv.size.name}
                                            {inv.quantity === 0 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-0.5 bg-gray-400 transform rotate-45 absolute"></div></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="font-medium py-2">Chất liệu: <span className="text-gray-400">{product.criteriaDTO.material}</span></div>
                            <div className="font-medium">Màu sắc: <span className="text-gray-400">{product.criteriaDTO.color}</span></div>

                            {/* Quantity */}
                            <div className="flex flex-col gap-3 pt-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-100 rounded-2xl">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1 || !selectedSize} className={`w-10 h-10 hover:bg-gray-200 rounded-l ${!selectedSize || quantity <= 1 ? 'opacity-50' : ''}`}>-</button>
                                        <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(getMaxQuantity(), parseInt(e.target.value) || 1)))} min="1" max={getMaxQuantity()} disabled={!selectedSize} className="w-12 h-10 bg-gray-100 text-center focus:outline-none" />
                                        <button onClick={() => setQuantity(Math.min(getMaxQuantity(), quantity + 1))} disabled={!selectedSize || quantity >= getMaxQuantity()} className={`w-10 h-10 hover:bg-gray-200 rounded-r ${!selectedSize || quantity >= getMaxQuantity() ? 'opacity-50' : ''}`}>+</button>
                                    </div>
                                    <div className="text-lg font-semibold">{formatPrice(product.criteriaDTO.price * quantity)}đ</div>
                                </div>

                                <button onClick={addToCart} disabled={!selectedSize || quantity <= 0} className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium ${selectedSize && quantity > 0 ? 'bg-white hover:bg-stone-300 border-2 border-stone-600' : 'bg-gray-400 cursor-not-allowed'}`}>
                                    <ShoppingCart size={20} /> Thêm vào Giỏ hàng
                                </button>

                                <button onClick={buyNow} disabled={!selectedSize || quantity <= 0} className={`w-full py-3 rounded-xl text-white font-medium ${selectedSize && quantity > 0 ? 'bg-stone-600 hover:bg-stone-900' : 'bg-gray-400 cursor-not-allowed'}`}>
                                    Mua ngay
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {product.content && (
                            <div className="mt-8 pt-8 border-t">
                                <h3 className="text-xl font-bold mb-4">Mô tả sản phẩm</h3>
                                <div className="text-gray-700 whitespace-pre-wrap">{product.content}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
