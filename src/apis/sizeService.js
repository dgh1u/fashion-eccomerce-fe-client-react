import axios from '@/axios';

// Lấy danh sách tất cả size
export const getAllSizes = async () => {
    return axios({
        url: '/api/sizes',
        method: 'GET',
    });
};

// Lấy thông tin inventory của sản phẩm
export const getProductInventory = async (productId) => {
    return axios({
        url: `/api/product/${productId}/inventory`,
        method: 'GET',
    });
};

// Cập nhật inventory của sản phẩm
export const updateProductInventory = async (productId, inventoryData) => {
    return axios({
        url: `/api/product/${productId}/inventory`,
        method: 'PUT',
        data: inventoryData,
    });
};
