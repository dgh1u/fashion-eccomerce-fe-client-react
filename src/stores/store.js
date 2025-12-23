import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser } from '../apis/authService';
import { cartService } from '../apis/cartService';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: '',
            isAuthenticated: false,
            avatar: '',

            // Đăng nhập: gọi loginUser
            login: async (email, password) => {
                if (!email || !password) {
                    return;
                }
                try {
                    const response = await loginUser(email, password);
                    if (!response || !response.token) {
                        throw new Error('Email hoặc mật khẩu không chính xác');
                    }

                    // Cập nhật thông tin người dùng
                    set({
                        user: response,
                        token: response.token,
                        isAuthenticated: true,
                    });

                    return response;
                } catch (error) {
                    if (error.response) {
                        console.error(error.response.data.message || 'Đăng nhập thất bại.');
                    } else {
                        console.error('Lỗi kết nối hoặc lỗi không xác định:', error.message);
                    }
                    set({
                        user: null,
                        token: '',
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },

            // Đăng xuất
            logout: async () => {
                try {
                    await logoutUser();
                } catch (error) {
                    console.warn('Logout API failed, proceeding to clear session.');
                } finally {
                    set({
                        user: null,
                        token: '',
                        isAuthenticated: false,
                        avatar: '',
                    });
                    localStorage.removeItem('auth-storage');
                    localStorage.removeItem('chatMessages');
                }
            },

            // Hàm cập nhật avatar trong store (nếu cần update sau này)
            setAvatar: (newAvatar) => set({ avatar: newAvatar }),

            // Legacy methods for compatibility
            setAuth: (token, user) => set({
                token,
                user,
                isAuthenticated: true
            }),

            clearAuth: () => set({
                token: null,
                user: null,
                isAuthenticated: false,
                avatar: '',
            }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export const useCartStore = create((set, get) => ({
    cart: null,
    loading: false,

    // Computed properties as methods
    cartItemCount: () => get().cart?.items?.length || 0,
    cartTotal: () => get().cart?.totalAmount || 0,
    cartItems: () => get().cart?.items || [],

    // Actions
    fetchCart: async () => {
        try {
            set({ loading: true });
            const response = await cartService.getCart();
            set({ cart: response.data });
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (productId, sizeId, quantity = 1) => {
        try {
            const response = await cartService.addToCart(productId, sizeId, quantity);
            // Fetch lại cart để cập nhật số lượng sản phẩm
            await get().fetchCart();
            return response;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    updateCartItem: async (cartItemId, quantity) => {
        try {
            const response = await cartService.updateCartItem(cartItemId, quantity);
            set({ cart: response.data });
            return response;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    removeFromCart: async (cartItemId) => {
        try {
            const response = await cartService.removeFromCart(cartItemId);
            set({ cart: response.data });
            return response;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            await cartService.clearCart();
            set({
                cart: {
                    cartId: null,
                    userId: null,
                    totalItems: 0,
                    totalAmount: 0,
                    items: []
                }
            });
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },
}));
