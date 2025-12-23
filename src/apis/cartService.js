import axios from '../axios.js';

export const cartService = {
    // Lấy giỏ hàng của user hiện tại
    getCart: async () => {
        return await axios.get('/api/cart');
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart: async (productId, sizeId, quantity = 1) => {
        return await axios.post('/api/cart/add', {
            productId,
            sizeId,
            quantity
        });
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartItem: async (cartItemId, quantity) => {
        return await axios.put('/api/cart/update', {
            cartItemId,
            quantity
        });
    },

    // Xóa từng sản phẩm khỏi giỏ hàng
    removeFromCart: async (cartItemId) => {
        return await axios.delete(`/api/cart/remove/${cartItemId}`);
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async () => {
        return await axios.delete('/api/cart/clear');
    }
};
