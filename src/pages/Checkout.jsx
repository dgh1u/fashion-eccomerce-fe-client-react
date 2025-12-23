import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useCartStore, useAuthStore } from '../stores/store';
import { checkoutService } from '../apis/checkoutService';
import { getImageByProduct } from '../apis/imageService';

export default function Checkout() {
    const navigate = useNavigate();
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('payos');
    const [productImages, setProductImages] = useState(new Map());
    const [checkoutData, setCheckoutData] = useState({
        customerName: '',
        customerPhone: '',
        shippingAddress: '',
        notes: '',
    });

    const totalAmount = useMemo(() => cartStore.cartTotal(), [cartStore.cartTotal()]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);
    const getImageUrl = (image) => image || 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image';
    const handleImageError = (e) => { e.target.src = 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image'; };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!checkoutData.customerName.trim()) {
            alert('Vui lòng nhập họ và tên');
            return;
        }
        if (!checkoutData.customerPhone.trim()) {
            alert('Vui lòng nhập số điện thoại');
            return;
        }
        if (!checkoutData.shippingAddress.trim()) {
            alert('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        setProcessing(true);
        try {
            // Prepare checkout data
            const payload = {
                customerName: checkoutData.customerName.trim(),
                customerPhone: checkoutData.customerPhone.trim(),
                shippingAddress: checkoutData.shippingAddress.trim(),
                notes: checkoutData.notes.trim(),
                totalAmount: totalAmount
            };

            const res = await checkoutService.checkout(payload);

            if (res?.data?.url) {
                // Store checkout info for later use
                localStorage.setItem('checkout_info', JSON.stringify({
                    orderCode: res.data.orderCode,
                    orderId: res.data.orderId,
                    customerInfo: payload
                }));

                // Redirect to PayOS
                window.location.href = res.data.url;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Có lỗi xảy ra khi thanh toán: ' + (err.message || 'Vui lòng thử lại'));
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => { cartStore.fetchCart(); }, []);

    useEffect(() => {
        const loadProductData = async () => {
            const newImages = new Map(productImages);

            for (const item of cartStore.cartItems()) {
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
        };
        if (cartStore.cartItems().length > 0) loadProductData();
    }, [cartStore.cartItems().length]);

    useEffect(() => {
        // Check if user is authenticated
        if (!authStore.isAuthenticated) {
            navigate('/login');
            return;
        }

        // Pre-fill user info if available
        if (authStore.user) {
            setCheckoutData({
                customerName: authStore.user.fullName || '',
                customerPhone: authStore.user.phone || '',
                shippingAddress: authStore.user.address || '',
                notes: '',
            });
        }
    }, []);

    const cartItems = cartStore.cartItems().map((item) => ({ ...item, productImage: productImages.get(item.productId) || item.productImage }));

    return (
        <div className="min-h-screen bg-gray-50 py-5">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex justify-between text-2xl font-bold items-center mb-8">
                    <span>Thanh toán</span>
                    <Link to="/cart" className="text-blue-600 text-base font-medium hover:underline">Quay lại giỏ hàng</Link>
                </div>

                {cartStore.loading ? (
                    <div className="text-center py-12">Đang tải...</div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <h3 className="text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h3>
                        <p className="text-gray-600 mb-5">Không thể tiến hành thanh toán với giỏ hàng trống.</p>
                        <Link to="/clothing" className="inline-flex px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">Khám phá sản phẩm</Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[300px_1fr] gap-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-4 h-fit sticky top-5">
                            <h3 className="mb-3 text-base font-bold text-gray-800">Đơn hàng của bạn</h3>
                            <div className="mb-3">
                                {cartItems.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-2 py-2 border-b last:border-b-0">
                                        <img src={getImageUrl(item.productImage)} alt={item.productTitle} onError={handleImageError} className="w-12 h-12 object-cover rounded" />
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold text-gray-800 line-clamp-1">{item.productTitle}</div>
                                            <div className="text-xs text-gray-600">Size: {item.sizeName} | SL: {item.quantity}</div>
                                            <div className="text-xs text-green-600 font-semibold">{formatPrice(item.totalPrice)}đ</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-3">
                                <div className="flex justify-between mb-1.5 text-sm text-gray-800"><span>Tạm tính:</span><span>{formatPrice(totalAmount)}đ</span></div>
                                <div className="flex justify-between mb-1.5 text-sm text-gray-800"><span>Phí vận chuyển:</span><span>Miễn phí</span></div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-base font-bold text-gray-800"><span>Tổng cộng:</span><span>{formatPrice(totalAmount)}đ</span></div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <h3 className="mb-6 text-gray-800">Thông tin giao hàng</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-5">
                                    <label className="block mb-1 font-semibold text-gray-800">Họ và tên *</label>
                                    <input type="text" value={checkoutData.customerName} onChange={(e) => setCheckoutData({ ...checkoutData, customerName: e.target.value })} placeholder="Nhập họ và tên" required className="w-full px-3 py-3 border-2 border-gray-300 rounded focus:border-blue-600 outline-none" />
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-1 font-semibold text-gray-800">Số điện thoại *</label>
                                    <input type="tel" value={checkoutData.customerPhone} onChange={(e) => setCheckoutData({ ...checkoutData, customerPhone: e.target.value })} placeholder="Nhập số điện thoại" pattern="[0-9]{10,11}" required className="w-full px-3 py-3 border-2 border-gray-300 rounded focus:border-blue-600 outline-none" />
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-1 font-semibold text-gray-800">Địa chỉ giao hàng *</label>
                                    <textarea value={checkoutData.shippingAddress} onChange={(e) => setCheckoutData({ ...checkoutData, shippingAddress: e.target.value })} placeholder="Nhập địa chỉ chi tiết" rows="3" required className="w-full px-3 py-3 border-2 border-gray-300 rounded focus:border-blue-600 outline-none" />
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-1 font-semibold text-gray-800">Ghi chú đơn hàng</label>
                                    <textarea value={checkoutData.notes} onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })} placeholder="Ghi chú cho đơn hàng (tùy chọn)" rows="2" className="w-full px-3 py-3 border-2 border-gray-300 rounded focus:border-blue-600 outline-none" />
                                </div>
                                <div className="my-8 p-5 border rounded bg-gray-50">
                                    <h4 className="mb-4 font-semibold text-gray-800 text-base">Phương thức thanh toán</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input type="radio" id="payos" value="payos" checked={paymentMethod === 'payos'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <label htmlFor="payos" className="flex items-center gap-2 cursor-pointer"><Landmark className="w-5 h-5" />Thanh toán qua Chuyển khoản ngân hàng (QR Code)</label>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">Bạn sẽ được chuyển hướng đến trang PayOS để thanh toán bằng QR code.</p>
                                </div>
                                <button type="submit" disabled={processing} className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {processing ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
