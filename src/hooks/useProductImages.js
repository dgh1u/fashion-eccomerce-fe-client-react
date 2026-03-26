import { useState, useCallback, useRef } from 'react';
import { getImageByProduct } from '../apis/imageService';

export function useProductImages() {
    const imageCache = useRef(new Map());
    const loadingImages = useRef(new Set());
    const [, forceUpdate] = useState({});

    // Hàm lấy hình ảnh sản phẩm với caching
    const getProductImage = useCallback(async (productId) => {
        // Kiểm tra cache trước
        if (imageCache.current.has(productId)) {
            return imageCache.current.get(productId);
        }

        // Kiểm tra xem đang tải ảnh này không
        if (loadingImages.current.has(productId)) {
            return null;
        }

        try {
            loadingImages.current.add(productId);

            const response = await getImageByProduct(productId);
            let imageUrls = [];

            // Xử lý response dựa trên cấu trúc trả về
            if (response?.data && Array.isArray(response.data)) {
                imageUrls = response.data;
            } else if (response?.body?.data && Array.isArray(response.body.data)) {
                imageUrls = response.body.data;
            } else if (response?.body && Array.isArray(response.body)) {
                imageUrls = response.body;
            } else if (Array.isArray(response)) {
                imageUrls = response;
            } else {
                console.warn(`Unexpected response structure for product ${productId}:`, response);
            }

            // Lấy ảnh đầu tiên
            const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

            // Lưu vào cache
            imageCache.current.set(productId, firstImageUrl);

            return firstImageUrl;
        } catch (error) {
            console.error(`Error loading image for product ${productId}:`, error);
            // Lưu null vào cache để không thử lại liên tục
            imageCache.current.set(productId, null);
            return null;
        } finally {
            loadingImages.current.delete(productId);
        }
    }, []);

    // Hàm chuyển đổi URL hình ảnh thành đường dẫn đầy đủ
    const getImageUrl = useCallback((imageUrl) => {
        if (!imageUrl) {
            return 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image';
        }

        // Nếu là URL đầy đủ, trả về ngay
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        // Nếu là đường dẫn tương đối, thêm base URL
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        return `${baseURL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }, []);

    // Hàm xử lý khi hình ảnh bị lỗi
    const handleImageError = useCallback((e) => {
        e.target.src = 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image';
    }, []);

    return {
        getProductImage,
        getImageUrl,
        handleImageError
    };
}
