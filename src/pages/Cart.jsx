import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import { Trash2, Loader2 } from 'lucide-react';
import { useCartStore } from '../stores/store';
import { getDetailProduct } from '../apis/productService';
import { getImageByProduct } from '../apis/imageService';

export default function Cart() {
    const navigate = useNavigate();
    const cartStore = useCartStore();
    const [updating, setUpdating] = useState(null);
    const [removing, setRemoving] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [productImages, setProductImages] = useState(new Map());
    const [productInventories, setProductInventories] = useState(new Map());

    const SHIPPING_FEE = 30000;
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);
    // Hàm lấy URL hình ảnh hoặc hình mặc định
    const getImageUrl = (image) => image || 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image';
    // Hàm xử lý khi hình ảnh lỗi
    const handleImageError = (e) => { e.target.src = 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image'; };

    // Hàm lấy số lượng còn lại trong kho
    const getAvailableQuantity = (productId, sizeId) => {
        const product = productInventories.get(productId);
        if (!product || !product.inventories) return 0;
        const inventory = product.inventories.find((inv) => inv.size.id === sizeId);
        return inventory?.quantity || 0;
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        const maxQty = getAvailableQuantity(item.productId, item.sizeId);

        // Check if trying to exceed available inventory
        if (newQuantity > maxQty) {
            message.warning(`Chỉ còn ${maxQty} sản phẩm trong kho cho size ${item.sizeName}`);
            return;
        }

        const validatedQty = newQuantity < 1 ? 1 : newQuantity > maxQty ? maxQty : newQuantity;
        if (validatedQty === item.quantity) return;

        setUpdating(item.cartItemId);
        try {
            await cartStore.updateCartItem(item.cartItemId, validatedQty);
            message.success('Cập nhật số lượng thành công');
        } catch (error) {
            console.error('Error updating quantity:', error);
            message.error('Có lỗi xảy ra khi cập nhật số lượng');
        } finally {
            setUpdating(null);
        }
    };

    // Hàm xóa một sản phẩm khỏi giỏ hàng
    const removeItem = (item) => {
        Modal.confirm({
            title: 'Xác nhận xóa sản phẩm',
            content: `Bạn có chắc muốn xóa "${item.productTitle}" khỏi giỏ hàng?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            async onOk() {
                setRemoving(item.cartItemId);
                try {
                    await cartStore.removeFromCart(item.cartItemId);
                    message.success('Đã xóa sản phẩm khỏi giỏ hàng');

                    // Clean up image and inventory from map if no other items use this product
                    const hasOtherItems = cartStore.cartItems().some(cartItem =>
                        cartItem.productId === item.productId && cartItem.cartItemId !== item.cartItemId
                    );
                    if (!hasOtherItems) {
                        setProductImages(prev => {
                            const newMap = new Map(prev);
                            newMap.delete(item.productId);
                            return newMap;
                        });
                        setProductInventories(prev => {
                            const newMap = new Map(prev);
                            newMap.delete(item.productId);
                            return newMap;
                        });
                    }
                } catch (error) {
                    console.error('Error removing item:', error);
                    message.error('Có lỗi xảy ra khi xóa sản phẩm');
                } finally {
                    setRemoving(null);
                }
            },
        });
    };

    // Hàm xóa toàn bộ sản phẩm trong giỏ hàng
    const clearAllCart = () => {
        Modal.confirm({
            title: 'Xác nhận xóa toàn bộ giỏ hàng',
            content: 'Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?',
            okText: 'Xóa tất cả',
            cancelText: 'Hủy',
            okType: 'danger',
            async onOk() {
                setClearing(true);
                try {
                    await cartStore.clearCart();
                    message.success('Đã xóa tất cả sản phẩm trong giỏ hàng');

                    // Clear all product images and inventories
                    setProductImages(new Map());
                    setProductInventories(new Map());
                } catch (error) {
                    console.error('Error clearing cart:', error);
                    message.error('Có lỗi xảy ra khi xóa giỏ hàng');
                } finally {
                    setClearing(false);
                }
            },
        });
    };

    useEffect(() => { cartStore.fetchCart(); }, []);

    useEffect(() => {
        const loadProductData = async () => {
            const newImages = new Map(productImages);
            const newInventories = new Map(productInventories);

            for (const item of cartStore.cartItems()) {
                // Load inventory data
                if (!newInventories.has(item.productId)) {
                    try {
                        const response = await getDetailProduct(item.productId);
                        if (response?.data) {
                            newInventories.set(item.productId, response.data);
                        }
                    } catch (error) {
                        console.error(`Failed to load inventory for product ${item.productId}:`, error);
                    }
                }

                // Load image separately using imageService
                if (!newImages.has(item.productId)) {
                    try {
                        const imageResponse = await getImageByProduct(item.productId);
                        let imageUrls = [];

                        // Handle different response structures
                        if (imageResponse?.data && Array.isArray(imageResponse.data)) {
                            imageUrls = imageResponse.data;
                        } else if (imageResponse?.body?.data && Array.isArray(imageResponse.body.data)) {
                            imageUrls = imageResponse.body.data;
                        } else if (imageResponse?.body && Array.isArray(imageResponse.body)) {
                            imageUrls = imageResponse.body;
                        } else if (Array.isArray(imageResponse)) {
                            imageUrls = imageResponse;
                        }

                        // Get first image
                        const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;
                        if (firstImageUrl) {
                            newImages.set(item.productId, firstImageUrl);
                        }
                    } catch (error) {
                        console.error(`Failed to load image for product ${item.productId}:`, error);
                    }
                }
            }

            setProductImages(newImages);
            setProductInventories(newInventories);
        };
        if (cartStore.cartItems().length > 0) loadProductData();
    }, [cartStore.cartItems().length]);

    const cartItems = cartStore.cartItems().map((item) => ({ ...item, productImage: productImages.get(item.productId) || item.productImage }));

    return (
        <div className="min-h-screen bg-white py-5">
            <div className="max-w-7xl mx-auto px-5">
                <div className="text-2xl font-bold mb-8">Giỏ hàng</div>
                {cartStore.loading ? (
                    <div className="text-center py-12">Đang tải...</div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <div className="text-6xl mb-5">🛒</div>
                        <h3>Giỏ hàng trống</h3>
                        <Link to="/clothing" className="inline-flex px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">Khám phá sản phẩm</Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                        <div className="bg-white rounded-lg shadow-sm">
                            {cartItems.map((item) => (
                                <div key={item.cartItemId} className="grid grid-cols-[80px_1fr_auto_auto_auto] gap-4 p-5 border-b items-center">
                                    <img src={getImageUrl(item.productImage)} alt={item.productTitle} onError={handleImageError} className="w-20 h-20 rounded-lg object-cover" />
                                    <div>
                                        <div className="font-semibold line-clamp-2">{item.productTitle}</div>
                                        <div className="text-sm text-gray-600">Size: {item.sizeName}</div>
                                        <div className="text-xs text-red-600">Còn: {getAvailableQuantity(item.productId, item.sizeId)}</div>
                                        <div className="text-green-600 font-bold">{formatPrice(item.unitPrice)}đ</div>
                                    </div>
                                    <div className="flex items-center gap-2 border rounded-2xl p-1">
                                        <button onClick={() => updateQuantity(item, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 hover:bg-gray-50 disabled:opacity-50">-</button>
                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item, item.quantity + 1)} disabled={item.quantity >= getAvailableQuantity(item.productId, item.sizeId)} className="w-8 h-8 hover:bg-gray-50 disabled:opacity-50">+</button>
                                    </div>
                                    <div className="font-bold">{formatPrice(item.totalPrice)}đ</div>
                                    <button onClick={() => removeItem(item)} disabled={removing === item.cartItemId} className="px-2 py-1.5 text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap flex items-center gap-1.5 text-xs transition-all duration-300 ease-in-out" title={`Xóa ${item.productTitle}`}>
                                        {removing === item.cartItemId ? <Loader2 className="animate-spin" size={12} /> : <Trash2 size={12} />}
                                        <span className="inline">{removing === item.cartItemId ? 'Đang xóa...' : 'Xóa'}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-5 h-fit sticky top-5">
                            <h3 className="m-0 mb-5 text-gray-800">Tóm tắt đơn hàng</h3>
                            <div className="flex justify-between mb-2 text-gray-800"><span>Tổng sản phẩm:</span><span>{cartStore.cartItemCount()} sản phẩm</span></div>
                            <div className="flex justify-between mb-2 text-gray-800"><span>Tạm tính:</span><span>{formatPrice(cartStore.cartTotal())}đ</span></div>
                            <div className="flex justify-between mb-2 text-gray-800"><span>Phí vận chuyển:</span><span>{formatPrice(SHIPPING_FEE)}đ</span></div>
                            <hr className="my-4" />
                            <div className="flex justify-between text-lg mt-2 text-gray-800"><span><strong>Tổng cộng:</strong></span><span><strong>{formatPrice(cartStore.cartTotal() + SHIPPING_FEE)}đ</strong></span></div>
                            <div className="flex flex-col gap-2 mt-5 text-base text-white">
                                <button onClick={() => navigate('/checkout')} className="px-6 py-3 rounded bg-green-600 text-white font-semibold text-center cursor-pointer border-0 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:bg-green-700">
                                    <i className="fas fa-credit-card text-white"></i>
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                        <button onClick={clearAllCart} disabled={clearing} className="px-6 py-3 rounded bg-transparent text-red-600 border-2 border-red-600 font-semibold text-center cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            <i className="fas fa-trash-alt"></i>
                            {clearing ? 'Đang xóa...' : 'Xóa tất cả'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
