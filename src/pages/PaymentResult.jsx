import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Loader2,
    CheckCircle,
    Image as ImageIcon,
    Truck,
    Phone,
    ShoppingBag,
    XCircle,
    RotateCcw,
    CreditCard,
    ShoppingCart,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import { checkoutService } from '../apis/checkoutService';
import { useCartStore } from '../stores/store';
import { getImageByProduct } from '../apis/imageService';

const PaymentResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const cartStore = useCartStore();

    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState(null);
    const [productImages, setProductImages] = useState(new Map());

    const getImageUrl = (image) => image || 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image';
    const handleImageError = (e) => { e.target.src = 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image'; };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';

        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateTimeString;
        }
    };

    const isPaymentSuccessful = (paymentData) => {
        if (!paymentData) return false;

        return paymentData.paymentSuccess === true ||
            paymentData.paymentStatus === 'success' ||
            paymentData.paymentStatus === 'PAID' ||
            paymentData.status === 'PAID' ||
            paymentData.status === 'CONFIRMED';
    };

    const loadOrderItemImages = async (orderItems) => {
        const newImages = new Map(productImages);

        for (const item of orderItems) {
            if (item.productId && !newImages.has(item.productId)) {
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

    const checkPaymentResult = async () => {
        try {
            setLoading(true);

            if (!id) {
                throw new Error('Không tìm thấy mã thanh toán');
            }

            const response = await checkoutService.getOrderFromPaymentResult(id);
            console.log('Order payment result response:', response);

            let responseData;

            if (response.body && response.body.data) {
                responseData = response.body.data;
            } else if (response.data) {
                responseData = response.data;
            } else {
                responseData = response;
            }

            setPaymentResult(responseData);
            console.log('Order payment result data:', responseData);
            console.log('Payment success status:', isPaymentSuccessful(responseData));

            if (responseData && responseData.orderItems && responseData.orderItems.length > 0) {
                await loadOrderItemImages(responseData.orderItems);
            }

            if (responseData && isPaymentSuccessful(responseData)) {
                console.log('Payment successful, refreshing cart');
                cartStore.fetchCart();
            } else {
                console.log('Payment not successful:', responseData?.paymentSuccess);
            }

        } catch (error) {
            console.error('Error checking payment result:', error);
            setPaymentResult(null);
        } finally {
            setLoading(false);
        }
    };

    const retryPayment = () => {
        const checkoutInfo = localStorage.getItem('checkout_info');

        if (checkoutInfo) {
            navigate('/checkout');
        } else {
            navigate('/cart');
        }
    };

    const checkAgain = () => {
        checkPaymentResult();
    };

    useEffect(() => {
        checkPaymentResult();
        localStorage.removeItem('checkout_info');
    }, [id]);

    // Merge product images into order items
    const orderItemsWithImages = paymentResult?.orderItems?.map((item) => ({
        ...item,
        productImage: productImages.get(item.productId) || item.productImage
    })) || [];

    return (
        <div className="min-h-screen bg-gray-50 py-5 flex items-center">
            <div className="max-w-2xl mx-auto px-5">
                {/* Loading */}
                {loading && (
                    <div className="text-center p-12 bg-white rounded-xl shadow-md">
                        <Loader2 className="h-10 w-10 text-blue-500 mb-4 animate-spin mx-auto" />
                        <p className="text-base text-gray-600 m-0">Đang kiểm tra kết quả thanh toán...</p>
                    </div>
                )}

                {/* Payment Success */}
                {!loading && paymentResult && isPaymentSuccessful(paymentResult) && (
                    <div className="bg-white rounded-xl shadow-md p-10 text-center">
                        <div className="text-green-500 mb-5 flex justify-center">
                            <CheckCircle className="h-20 w-20" />
                        </div>
                        <h1 className="m-0 mb-4 text-gray-800 text-3xl font-bold">Thanh toán thành công!</h1>
                        <p className="text-base text-gray-600 mb-8 leading-relaxed">
                            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left">
                            <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">Thông tin đơn hàng</h3>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Mã đơn hàng:</span>
                                <span><strong>#{paymentResult.orderCode}</strong></span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Tên khách hàng:</span>
                                <span><strong>{paymentResult.customerName}</strong></span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Số điện thoại:</span>
                                <span><strong>{paymentResult.customerPhone}</strong></span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Địa chỉ giao hàng:</span>
                                <span><strong>{paymentResult.shippingAddress}</strong></span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Tổng tiền:</span>
                                <span><strong>{formatPrice(paymentResult.totalAmount)}đ</strong></span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Thời gian đặt hàng:</span>
                                <span>{formatDateTime(paymentResult.createdAt)}</span>
                            </div>
                            {paymentResult.reference && (
                                <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                    <span>Mã tham chiếu thanh toán:</span>
                                    <span>{paymentResult.reference}</span>
                                </div>
                            )}
                            {paymentResult.notes && (
                                <div className="flex justify-between mb-0 pb-0 border-b-0">
                                    <span>Ghi chú:</span>
                                    <span>{paymentResult.notes}</span>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        {orderItemsWithImages.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left">
                                <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">Sản phẩm đã mua</h3>
                                <div className="flex flex-col gap-3">
                                    {orderItemsWithImages.map((item) => (
                                        <div key={item.id} className="flex bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="w-20 h-20 mr-3 rounded-md overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                                {item.productImage ? (
                                                    <img
                                                        src={getImageUrl(item.productImage)}
                                                        alt={item.productTitle}
                                                        onError={handleImageError}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="m-0 mb-2 text-base font-semibold text-gray-800 leading-tight">{item.productTitle}</h4>
                                                <div className="flex gap-3 mb-1.5 text-sm text-gray-600">
                                                    <span className="whitespace-nowrap">Size: {item.sizeName}</span>
                                                    <span className="whitespace-nowrap">Số Lượng: {item.quantity}</span>
                                                </div>
                                                <div className="text-sm text-gray-800">
                                                    Thành tiền: <strong className="text-blue-500">{formatPrice(item.totalPrice)}đ</strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left">
                            <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">Bước tiếp theo</h3>
                            <ul className="m-0 p-0 list-none">
                                <li className="mb-2.5 flex items-center gap-2.5">
                                    <Truck className="h-4 w-4 text-green-500" />
                                    Chúng tôi sẽ giao hàng trong 2-3 ngày làm việc
                                </li>
                                <li className="mb-0 flex items-center gap-2.5">
                                    <Phone className="h-4 w-4 text-green-500" />
                                    Bạn sẽ nhận được cuộc gọi xác nhận trước khi giao hàng
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/product/clothing"
                                className="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:text-white"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                )}

                {/* Payment Failed */}
                {!loading && paymentResult && !isPaymentSuccessful(paymentResult) && (
                    <div className="bg-white rounded-xl shadow-md p-10 text-center">
                        <div className="text-red-500 mb-5 flex justify-center">
                            <XCircle className="h-20 w-20" />
                        </div>
                        <h1 className="m-0 mb-4 text-gray-800 text-3xl font-bold">Thanh toán không thành công</h1>
                        <p className="text-base text-gray-600 mb-8 leading-relaxed">
                            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left">
                            <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">Thông tin đơn hàng</h3>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Mã đơn hàng:</span>
                                <span><strong>#{paymentResult.orderCode}</strong></span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Tên khách hàng:</span>
                                <span><strong>{paymentResult.customerName}</strong></span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span>Tổng tiền:</span>
                                <span><strong>{formatPrice(paymentResult.totalAmount)}đ</strong></span>
                            </div>
                            <div className="flex justify-between mb-0 pb-0 border-b-0">
                                <span>Thời gian đặt hàng:</span>
                                <span>{formatDateTime(paymentResult.createdAt)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left">
                            <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">Bạn có thể thử lại</h3>
                            <ul className="m-0 p-0 list-none">
                                <li className="mb-2.5 flex items-center gap-2.5">
                                    <RotateCcw className="h-4 w-4 text-blue-500" />
                                    Thử lại với cùng phương thức thanh toán
                                </li>
                                <li className="mb-2.5 flex items-center gap-2.5">
                                    <CreditCard className="h-4 w-4 text-blue-500" />
                                    Sử dụng thẻ/tài khoản khác
                                </li>
                                <li className="mb-0 flex items-center gap-2.5">
                                    <Phone className="h-4 w-4 text-blue-500" />
                                    Liên hệ hỗ trợ nếu vấn đề tiếp tục
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/cart"
                                className="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:text-white"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Quay lại giỏ hàng
                            </Link>
                            <button
                                onClick={retryPayment}
                                className="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-blue-500 text-white hover:bg-blue-700"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Thử lại thanh toán
                            </button>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {!loading && !paymentResult && (
                    <div className="bg-white rounded-xl shadow-md p-10 text-center">
                        <div className="text-yellow-400 mb-5 flex justify-center">
                            <AlertTriangle className="h-20 w-20" />
                        </div>
                        <h1 className="m-0 mb-4 text-gray-800 text-3xl font-bold">Không thể xác định kết quả</h1>
                        <p className="text-base text-gray-600 mb-8 leading-relaxed">
                            Không tìm thấy thông tin thanh toán hoặc có lỗi xảy ra.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/cart"
                                className="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:text-white"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Quay lại giỏ hàng
                            </Link>
                            <button
                                onClick={checkAgain}
                                className="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-blue-500 text-white hover:bg-blue-700"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Kiểm tra lại
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
