import axios from '../axios.js';

export const orderService = {
    // Lấy danh sách đơn hàng của user hiện tại
    getMyOrders: async (page = 1, limit = 10, status = '') => {
        let url = `/api/orders?page=${page}&limit=${limit}`;
        if (status) {
            url += `&status=${status}`;
        }
        return await axios.get(url);
    },

    // Lấy chi tiết đơn hàng theo ID
    getOrderById: async (orderId) => {
        return await axios.get(`/api/orders/${orderId}`);
    },

    // Lấy đơn hàng theo order code
    getOrderByCode: async (orderCode) => {
        return await axios.get(`/api/orders/code/${orderCode}`);
    },

    // Hủy đơn hàng
    cancelOrder: async (orderId) => {
        return await axios.patch(`/api/order/${orderId}/cancel`);
    }
};
