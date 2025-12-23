import React, { useEffect } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { useCartStore } from '../stores/store';
import { useAuthStore } from '../stores/store';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => {
    const { cartItemCount, fetchCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const handleGoToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/cart');
    };

    // Load cart khi component mount (chỉ khi đã đăng nhập)
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    return (
        <div
            className="relative cursor-pointer p-2.5 text-gray-800 transition-colors duration-300 flex flex-col items-center justify-center gap-1 hover:text-blue-600"
            onClick={handleGoToCart}
        >
            <ShoppingBasket size={25} />
            {cartItemCount() > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-weight-bold">
                    {cartItemCount()}
                </span>
            )}
            <span className="text-xs font-medium whitespace-nowrap">Giỏ hàng</span>
        </div>
    );
};

export default CartIcon;
