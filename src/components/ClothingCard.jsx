import React, { useState, useEffect, useMemo } from 'react';
import { getImageByProduct } from '../apis/imageService';

const ClothingCard = ({ product }) => {
    const placeholder = 'https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image';
    const [fetchedImages, setFetchedImages] = useState([]);

    useEffect(() => {
        if (!product.id) return;

        const fetchImages = async () => {
            try {
                const images = await getImageByProduct(product.id);
                setFetchedImages(Array.isArray(images) ? images : []);
            } catch {
                setFetchedImages([]);
            }
        };

        fetchImages();
    }, [product.id]);

    const thumbnailImage = useMemo(() => {
        return fetchedImages.length > 0 ? fetchedImages[0] : placeholder;
    }, [fetchedImages]);

    const discountPercentage = useMemo(() => {
        const originalPrice = parseFloat(product.criteriaDTO?.originalPrice) || 0;
        const currentPrice = parseFloat(product.criteriaDTO?.price) || 0;

        if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
            return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
        }
        return 0;
    }, [product]);

    const hasValidDiscount = useMemo(() => {
        const originalPrice = parseFloat(product.criteriaDTO?.originalPrice) || 0;
        const currentPrice = parseFloat(product.criteriaDTO?.price) || 0;
        return originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice;
    }, [product]);

    // Hàm định dạng giá tiền theo chuẩn Việt Nam
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // Hàm xử lý khi hình ảnh lỗi
    const handleImgError = (event) => {
        console.error('⚠️ Image failed to load:', event.target.src);
        event.target.src = placeholder;
    };

    return (
        <div className="rounded-lg p-4 hover:scale-[1.03] hover:shadow-lg hover:bg-white transition flex flex-col w-full">
            <div className="w-full flex flex-col gap-2">
                <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden relative">
                    {/* NEW badge */}
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        NEW
                    </div>
                    <img
                        src={thumbnailImage}
                        alt="preview"
                        onError={handleImgError}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
            <div className="flex-1 flex flex-col py-3">
                {/* Hiển thị tiêu đề bài đăng */}
                <span className="line-clamp-2 text-base font-medium text-gray-800 mb-2 text-left leading-tight">
                    {product.title}
                </span>

                {/* Price section with discount */}
                <div className="flex items-center gap-2 text-left">
                    {/* Current discounted price */}
                    <span className="text-lg font-bold text-black">
                        {formatPrice(product.criteriaDTO?.price)}
                    </span>

                    {/* Discount percentage badge and original price - only show if there's a valid discount */}
                    {hasValidDiscount && (
                        <>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                -{discountPercentage}%
                            </span>

                            {/* Original price with strikethrough */}
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.criteriaDTO?.originalPrice)}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClothingCard;
