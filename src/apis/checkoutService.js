import axios from '../axios.js';

export const checkoutService = {
    // Thanh toán giỏ hàng
    checkout: async (customerInfo) => {
        return await axios.post('/api/checkout', customerInfo);
    },

    // Kiểm tra trạng thái thanh toán đơn hàng
    getOrderPaymentStatus: async (orderCode) => {
        return await axios.get(`/api/payment/order/${orderCode}/status`);
    },

    // Lấy kết quả thanh toán theo payment history id
    getPaymentResult: async (paymentHistoryId) => {
        return await axios.get(`/api/payment/result/${paymentHistoryId}`);
    },

    // Lấy thông tin đơn hàng từ payment result (NEW)
    getOrderFromPaymentResult: async (paymentHistoryId) => {
        return await axios.get(`/api/payment/result/${paymentHistoryId}/order`);
    }
};
