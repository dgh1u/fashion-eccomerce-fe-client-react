import axios from '@/axios';

// Lấy tất cả bài viết
export const getListProduct = async (params) => {
    return axios({
        url: '/api/products',
        method: 'GET',
        params: params,
    });
};

// Lấy chi tiết 1 bài viết
export const getDetailProduct = async (id) => {
    return axios({
        url: `api/product/${id}`,
        method: 'GET',
    });
};

// Lấy danh sách tin đăng của một người dùng theo userId
export const getProductsByUserId = async (idUser, params) => {
    return axios({
        url: `/api/products/${idUser}`,
        method: 'GET',
        params: params,
    });
};

export const createProduct = async (data) => {
    return axios({
        url: `/api/product`,
        method: 'POST',
        data,
    });
};

export const updateProduct = async (id, data) => {
    return axios({
        url: `/api/product/${id}`,
        method: 'PUT',
        data,
    });
};

export const hideProduct = async (id) => {
    return axios({
        url: `/api/product/hide/${id}`,
        method: 'PUT',
    });
};
