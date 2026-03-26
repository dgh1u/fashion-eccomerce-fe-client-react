import React, { useState, useEffect } from 'react';
import { Tag, Modal, message, Select, Spin, Pagination, Button } from 'antd';
import {
    ShoppingBag,
    LoaderCircle,
    Package,
    ShoppingCart,
    User,
    Phone,
    MapPin,
    X,
    Image as ImageIcon
} from 'lucide-react';
import { orderService } from '../apis/orderService';
import { useProductImages } from '../hooks/useProductImages';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');

    const { getProductImage, getImageUrl, handleImageError } = useProductImages();

    // Hàm lấy danh sách đơn hàng
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderService.getMyOrders(currentPage, pageSize, statusFilter);
            if (response.success) {
                const ordersList = response.data.items;
                setTotalOrders(response.data.total);

                // Set orders first
                setOrders(ordersList);

                // Load images for products asynchronously
                loadOrderItemImages(ordersList);
            } else {
                message.error('Không thể tải danh sách đơn hàng');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Có lỗi xảy ra khi tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Hàm tải hình ảnh cho các sản phẩm trong đơn hàng
    const loadOrderItemImages = async (ordersList) => {
        for (const order of ordersList) {
            if (order.orderItems && order.orderItems.length > 0) {
                for (const item of order.orderItems) {
                    if (item.productId) {
                        try {
                            const imageUrl = await getProductImage(item.productId);
                            if (imageUrl) {
                                item.productImage = imageUrl;
                                // Force re-render by updating the orders state
                                setOrders(prevOrders => [...prevOrders]);
                            }
                        } catch (error) {
                            console.error(`Failed to load image for product ${item.productId}:`, error);
                        }
                    }
                }
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    // Hàm xử lý khi thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Hàm xử lý khi thay đổi trạng thái lọc
    const handleStatusChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    // Hàm xử lý hủy đơn hàng
    const handleCancelOrder = async (orderId) => {
        Modal.confirm({
            title: 'Xác nhận hủy đơn hàng',
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?\n\nLưu ý: Đơn hàng (bao gồm cả đơn đã thanh toán) chỉ có thể hủy trong vòng 24 giờ kể từ thời gian đặt hàng. Hành động này không thể hoàn tác.',
            okText: 'Có, hủy đơn hàng',
            cancelText: 'Không',
            okType: 'danger',
            onOk: async () => {
                try {
                    await orderService.cancelOrder(orderId);
                    message.success('Hủy đơn hàng thành công');
                    fetchOrders();
                } catch (error) {
                    console.error('Error canceling order:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data ||
                        'Không thể hủy đơn hàng';
                    message.error(errorMessage);
                }
            },
        });
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Hàm định dạng tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Hàm kiểm tra xem đơn hàng có thể hủy hay không
    const canCancelOrder = (order) => {
        if (order.status !== 'pending' && order.status !== 'paid') {
            return false;
        }

        const now = new Date();
        const orderCreatedAt = new Date(order.createdAt);
        const hoursElapsed = (now - orderCreatedAt) / (1000 * 60 * 60);

        return hoursElapsed <= 24;
    };

    // Hàm lấy thông báo lý do không thể hủy đơn
    const getCancelReasonMessage = (order) => {
        if (order.status !== 'pending' && order.status !== 'paid') {
            return 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý hoặc đã thanh toán';
        }

        const now = new Date();
        const orderCreatedAt = new Date(order.createdAt);
        const hoursElapsed = Math.floor((now - orderCreatedAt) / (1000 * 60 * 60));

        if (hoursElapsed > 24) {
            return `Không thể hủy đơn hàng sau 24 giờ. Đơn hàng này đã được đặt cách đây ${hoursElapsed} giờ`;
        }

        return '';
    };

    // Hàm lấy cảnh báo cho đơn hàng đã thanh toán
    const getPaidOrderWarning = (order) => {
        if (order.status !== 'paid') {
            return null;
        }

        const now = new Date();
        const orderCreatedAt = new Date(order.createdAt);
        const hoursElapsed = (now - orderCreatedAt) / (1000 * 60 * 60);

        if (hoursElapsed >= 24) {
            return null;
        }

        const hoursLeft = 24 - hoursElapsed;
        let timeText;

        if (hoursLeft >= 1) {
            timeText = `${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}p`;
        } else {
            timeText = `${Math.floor(hoursLeft * 60)}p`;
        }

        return `⏰ Còn ${timeText} để hủy đơn hàng này. Sau khi hủy đơn hàng hãy liên hệ với bộ phận chăm sóc khách hàng để lấy lại tiền.`;
    };

    // Hàm lấy cảnh báo tự động hủy đơn
    const getAutoCancelWarning = (order) => {
        if (order.status !== 'pending') {
            return null;
        }

        const now = new Date();
        const orderCreatedAt = new Date(order.createdAt);
        const hoursElapsed = (now - orderCreatedAt) / (1000 * 60 * 60);

        if (hoursElapsed >= 24) {
            return null;
        }

        const hoursLeft = 24 - hoursElapsed;

        if (hoursLeft >= 1) {
            return `⚠️ Hệ thống sẽ tự động hủy đơn hàng này sau ${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}p`;
        } else {
            return `⚠️ Hệ thống sẽ tự động hủy đơn hàng này sau ${Math.floor(hoursLeft * 60)}p`;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            paid: 'green',
            cancelled: 'red'
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Chờ xử lý',
            paid: 'Đã thanh toán',
            cancelled: 'Đã hủy'
        };
        return texts[status] || status;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <ShoppingBag className="mr-3 h-6 w-6" />
                            Lịch sử đơn hàng
                        </h1>
                        <p className="text-gray-600 mt-1">Theo dõi tình trạng các đơn hàng của bạn</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Select
                            value={statusFilter}
                            placeholder="Lọc theo trạng thái"
                            className="w-40"
                            onChange={handleStatusChange}
                        >
                            <Select.Option value="">Tất cả</Select.Option>
                            <Select.Option value="pending">Chờ xử lý</Select.Option>
                            <Select.Option value="paid">Đã thanh toán</Select.Option>
                            <Select.Option value="cancelled">Đã hủy</Select.Option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && orders.length === 0 && (
                <div className="flex justify-center py-12">
                    <Spin size="large" indicator={<LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />} />
                </div>
            )}

            {/* Empty State */}
            {!loading && orders.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
                    <a href="/home">
                        <Button type="primary" size="large" icon={<ShoppingCart className="mr-2 h-4 w-4" />}>
                            Bắt đầu mua sắm
                        </Button>
                    </a>
                </div>
            )}

            {/* Orders List */}
            {!loading && orders.length > 0 && (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Order Header */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Mã đơn hàng</p>
                                            <p className="text-lg font-bold text-blue-600">#{order.orderCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Ngày đặt</p>
                                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Tổng tiền</p>
                                            <p className="text-lg font-bold text-red-600">{formatCurrency(order.totalAmount)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col items-end space-y-1">
                                            <Tag
                                                color={getStatusColor(order.status)}
                                                className="px-3 py-1 text-sm font-medium rounded-full"
                                            >
                                                {getStatusText(order.status)}
                                            </Tag>
                                            {/* Warning for paid orders */}
                                            {getPaidOrderWarning(order) && (
                                                <div className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded border border-blue-200 max-w-xs">
                                                    {getPaidOrderWarning(order)}
                                                </div>
                                            )}
                                            {/* Warning for pending orders */}
                                            {getAutoCancelWarning(order) && (
                                                <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded font-medium">
                                                    {getAutoCancelWarning(order)}
                                                </div>
                                            )}
                                        </div>
                                        {canCancelOrder(order) ? (
                                            <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                icon={<X className="h-4 w-4" />}
                                                onClick={() => handleCancelOrder(order.id)}
                                            >
                                                Hủy đơn
                                            </Button>
                                        ) : (order.status === 'pending' || order.status === 'paid') ? (
                                            <Button
                                                type="default"
                                                size="small"
                                                disabled
                                                title={getCancelReasonMessage(order)}
                                            >
                                                Hủy đơn
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Order Info */}
                            <div className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Thông tin giao hàng</p>
                                        <div className="text-sm text-gray-600">
                                            <p className="flex items-center"><User className="mr-2 h-4 w-4" />{order.customerName}</p>
                                            <p className="flex items-center mt-1"><Phone className="mr-2 h-4 w-4" />{order.customerPhone}</p>
                                            <p className="flex items-center mt-1"><MapPin className="mr-2 h-4 w-4" />{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                    {order.notes && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Ghi chú</p>
                                            <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">{order.notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Order Items */}
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-sm font-medium text-gray-900 mb-3">Sản phẩm đã đặt ({order.orderItems?.length || 0})</p>
                                    <div className="space-y-3">
                                        {order.orderItems?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                        {item.productImage ? (
                                                            <img
                                                                src={getImageUrl(item.productImage)}
                                                                alt={item.productTitle}
                                                                onError={handleImageError}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <ImageIcon className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{item.productTitle}</h4>
                                                        <div className="flex items-center space-x-4 mt-1">
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                Size: {item.sizeName}
                                                            </span>
                                                            <span className="text-xs text-gray-500">Số lượng: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice)} x {item.quantity}</p>
                                                    <p className="font-bold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {orders.length > 0 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        current={currentPage}
                        total={totalOrders}
                        pageSize={pageSize}
                        showSizeChanger={false}
                        showQuickJumper={true}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`}
                        onChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
