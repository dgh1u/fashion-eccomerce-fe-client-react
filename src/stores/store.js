/**
 * File store tổng hợp cho ứng dụng client
 * Bao gồm 2 stores chính:
 * 1. useAuthStore - Quản lý xác thực và thông tin người dùng
 * 2. useCartStore - Quản lý giỏ hàng
 */

// Import thư viện Zustand để quản lý state toàn cục
import { create } from 'zustand';
// Import middleware persist để lưu trữ state vào localStorage
import { persist } from 'zustand/middleware';
// Import các API service liên quan đến xác thực
import { loginUser, logoutUser } from '../apis/authService';
// Import cart service để xử lý các thao tác với giỏ hàng
import { cartService } from '../apis/cartService';

/**
 * =================================================================
 * AUTH STORE - Quản lý xác thực người dùng
 * =================================================================
 * Store này quản lý: thông tin user, token, trạng thái đăng nhập
 * Sử dụng persist middleware để lưu vào localStorage
 */
export const useAuthStore = create(
    persist(
        (set) => ({
            // Thông tin người dùng sau khi đăng nhập (id, email, fullName, role, phone, address...)
            user: null,
            // Token JWT để xác thực các API request
            token: '',
            // Trạng thái đăng nhập: true nếu đã đăng nhập, false nếu chưa
            isAuthenticated: false,
            // Avatar người dùng (có thể là URL hoặc base64 string)
            avatar: '',

            /**
             * Hàm xử lý đăng nhập người dùng
             * @param {string} email - Email đăng nhập
             * @param {string} password - Mật khẩu
             * @returns {Promise} Trả về thông tin người dùng nếu thành công
             * @throws {Error}Ném lỗi nếu email/password không đúng hoặc có lỗi kết nối
             * 
             * Quy trình:
             * 1. Kiểm tra email và password có được cung cấp
             * 2. Gọi API loginUser để xác thực
             * 3. Lưu thông tin user, token vào store
             * 4. Trả về response để component xử lý tiếp
             */
            login: async (email, password) => {
                // Kiểm tra email và password có được cung cấp không
                if (!email || !password) {
                    return;
                }
                try {
                    // Gọi API đăng nhập
                    const response = await loginUser(email, password);
                    // Kiểm tra response có hợp lệ và có token không
                    if (!response || !response.token) {
                        throw new Error('Email hoặc mật khẩu không chính xác');
                    }

                    // Cập nhật thông tin người dùng, token và trạng thái đăng nhập vào store
                    set({
                        user: response,
                        token: response.token,
                        isAuthenticated: true,
                    });

                    return response;
                } catch (error) {
                    // Xử lý các lỗi từ API hoặc lỗi kết nối
                    if (error.response) {
                        console.error(error.response.data.message || 'Đăng nhập thất bại.');
                    } else {
                        console.error('Lỗi kết nối hoặc lỗi không xác định:', error.message);
                    }
                    // Reset lại state về trạng thái chưa đăng nhập khi có lỗi
                    set({
                        user: null,
                        token: '',
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },

            /**
             * Hàm xử lý đăng xuất người dùng
             * 
             * Quy trình:
             * 1. Gọi API logoutUser để thông báo server (optional)
             * 2. Xóa tất cả thông tin user, token, avatar khỏi store
             * 3. Xóa dữ liệu persist trong localStorage (auth-storage)
             * 4. Xóa chat messages trong localStorage
             * 
             * Sử dụng finally để đảm bảo dữ liệu luôn được xóa dù API có lỗi hay không
             */
            logout: async () => {
                try {
                    // Gọi API đăng xuất (nếu server có endpoint logout)
                    await logoutUser();
                } catch (error) {
                    // Nếu API logout lỗi, vẫn tiếp tục xóa session local
                    console.warn('Logout API failed, proceeding to clear session.');
                } finally {
                    // Luôn xóa thông tin đăng nhập trong store (dù API có lỗi hay không)
                    set({
                        user: null,
                        token: '',
                        isAuthenticated: false,
                        avatar: '',
                    });
                    // Xóa dữ liệu persist trong localStorage
                    localStorage.removeItem('auth-storage');
                    // Xóa tin nhắn chat (nếu có) để đảm bảo privacy
                    localStorage.removeItem('chatMessages');
                }
            },

            /**
             * Hàm cập nhật avatar trong store
             * @param {string} newAvatar - Avatar mới (base64 string hoặc URL)
             * Sử dụng khi muốn thay đổi avatar sau khi user đã cập nhật ảnh đại diện
             */
            setAvatar: (newAvatar) => set({ avatar: newAvatar }),

            /**
             * Các hàm legacy để tương thích với code cũ
             * Được giữ lại để đảm bảo các component cũ vẫn hoạt động
             */

            /**
             * Hàm set thông tin xác thực (legacy)
             * @param {string} token - JWT token
             * @param {object} user - Thông tin người dùng
             */
            setAuth: (token, user) => set({
                token,
                user,
                isAuthenticated: true
            }),

            /**
             * Hàm xóa thông tin xác thực (legacy)
             * Tương tự logout nhưng không gọi API
             */
            clearAuth: () => set({
                token: null,
                user: null,
                isAuthenticated: false,
                avatar: '',
            }),
        }),
        {
            // Tên key lưu trữ trong localStorage
            // Toàn bộ state của authStore sẽ được lưu vào localStorage với key 'auth-storage'
            // Giúp duy trì trạng thái đăng nhập khi user refresh trang hoặc đóng/mở browser
            name: 'auth-storage',
        }
    )
);

/**
 * =================================================================
 * CART STORE - Quản lý giỏ hàng
 * =================================================================
 * Store này quản lý:
 * - Thông tin giỏ hàng (cart object với items, totalAmount, totalItems)
 * - Trạng thái loading khi thao tác với giỏ hàng
 * - Các actions: thêm, sửa, xóa sản phẩm trong giỏ
 * 
 * Không sử dụng persist để tránh đồng bộ sai giữa local và server
 * Luôn fetch cart mới từ server khi cần
 */
export const useCartStore = create((set, get) => ({
    // Object chứa thông tin giỏ hàng: cartId, userId, items[], totalAmount, totalItems
    cart: null,
    // Trạng thái loading khi đang thực hiện các thao tác với giỏ hàng
    loading: false,

    /**
     * =================================================================
     * COMPUTED PROPERTIES - Các thuộc tính tính toán
     * =================================================================
     * Được định nghĩa như methods để lấy giá trị real-time từ cart
     */

    /**
     * Lấy số lượng sản phẩm trong giỏ (không phải tổng số lượng, mà là số loại sản phẩm)
     * @returns {number} Số lượng items trong giỏ
     */
    cartItemCount: () => get().cart?.items?.length || 0,

    /**
     * Lấy tổng giá trị đơn hàng
     * @returns {number} Tổng tiền của tất cả sản phẩm trong giỏ
     */
    cartTotal: () => get().cart?.totalAmount || 0,

    /**
     * Lấy danh sách các items trong giỏ
     * @returns {Array} Mảng các cart items
     */
    cartItems: () => get().cart?.items || [],

    /**
     * =================================================================
     * ACTIONS - Các hàm thao tác với giỏ hàng
     * =================================================================
     */
    fetchCart: async () => {
        try {
            set({ loading: true });
            const response = await cartService.getCart();
            set({ cart: response.data });
        } catch (error) {
            // Log lỗi nếu không lấy được giỏ hàng
            console.error('Error fetching cart:', error);
        } finally {
            // Luôn tắt loading dù thành công hay lỗi
            set({ loading: false });
        }
    },

    /**
     * Hàm thêm sản phẩm vào giỏ hàng
     * @param {number} productId - ID của sản phẩm cần thêm
     * @param {number} sizeId - ID của size (đối với quần áo)
     * @param {number} quantity - Số lượng sản phẩm cần thêm (mặc định = 1)
     * @returns {Promise} Response từ API
     * @throws {Error} Nếu có lỗi khi thêm vào giỏ
     * 
     * Sau khi thêm thành công, tự động fetch lại cart để cập nhật UI
     */
    addToCart: async (productId, sizeId, quantity = 1) => {
        try {
            // Gọi API thêm sản phẩm vào giỏ
            const response = await cartService.addToCart(productId, sizeId, quantity);
            // Fetch lại cart từ server để đảm bảo đồng bộ (có thể có promotion, discount...)
            await get().fetchCart();
            return response;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    /**
     * Hàm cập nhật số lượng của một sản phẩm trong giỏ
     * @param {number} cartItemId - ID của cart item cần cập nhật
     * @param {number} quantity - Số lượng mới
     * @returns {Promise} Response từ API với cart đã được cập nhật
     * @throws {Error} Nếu có lỗi khi cập nhật
     * 
     * API trả về cart mới sau khi update, nên cập nhật trực tiếp vào store
     * Không cần fetch lại để tối ưu performance
     */
    updateCartItem: async (cartItemId, quantity) => {
        try {
            // Gọi API cập nhật số lượng
            const response = await cartService.updateCartItem(cartItemId, quantity);
            // Cập nhật cart mới từ response vào store
            set({ cart: response.data });
            return response;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    /**
     * Hàm xóa một sản phẩm khỏi giỏ hàng
     * @param {number} cartItemId - ID của cart item cần xóa
     * @returns {Promise} Response từ API với cart đã được cập nhật
     * @throws {Error} Nếu có lỗi khi xóa
     * 
     * API trả về cart mới sau khi xóa item, cập nhật trực tiếp vào store
     */
    removeFromCart: async (cartItemId) => {
        try {
            // Gọi API xóa sản phẩm khỏi giỏ
            const response = await cartService.removeFromCart(cartItemId);
            // Cập nhật cart mới (đã bỏ item) vào store
            set({ cart: response.data });
            return response;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    /**
     * Hàm xóa toàn bộ giỏ hàng
     * 
     * Được gọi khi:
     * - User muốn xóa hết giỏ hàng
     * - Sau khi đặt hàng thành công (reset giỏ)
     * 
     * Set cart về trạng thái rỗng với structure chuẩn
     */
    clearCart: async () => {
        try {
            // Gọi API xóa toàn bộ giỏ hàng trên server
            await cartService.clearCart();
            // Reset cart về trạng thái rỗng trong store
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
            // Log lỗi và throw để component có thể xử lý (hiển thị thông báo lỗi)
            console.error('Error clearing cart:', error);
            throw error;
        }
    },
}));
