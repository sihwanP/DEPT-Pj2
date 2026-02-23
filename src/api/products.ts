import api from './client';
import { FeaturedItem, LocalizedString } from '../types';

// Helper to transform DB row to Frontend Type
export const transformProduct = (row: any): FeaturedItem => {
    // In MySQL backend, details field contains JSON string or object
    const details = typeof row.details === 'string' ? JSON.parse(row.details) : row.details;

    return {
        id: row.id,
        title: (details?.original_title || { ko: row.name }) as LocalizedString,
        description: (details?.original_description || { ko: row.description }) as LocalizedString,
        category: row.category_name || row.category_id || 'Other',
        imageUrl: row.image_url,
        date: (details?.date || { ko: '' }) as LocalizedString,
        location: (details?.location || { ko: '' }) as LocalizedString,
        price: (details?.price || { ko: row.price.toString() }) as LocalizedString,
        closedDays: details?.closed_days || [],
        videoUrl: row.video_url || details?.video_url,
        user_id: row.user_id || undefined,
    };
};

export const getFeaturedProducts = async (): Promise<FeaturedItem[]> => {
    const response = await api.get('/api/products');
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(transformProduct);
};

export const getProductsByCategory = async (category: string): Promise<FeaturedItem[]> => {
    // Note: In backend, it might use categoryId. For now filtering by query
    const response = await api.get(`/api/products?category=${category}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(transformProduct);
};

export const getProductById = async (id: string): Promise<FeaturedItem | null> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data ? transformProduct(response.data) : null;
};
export const searchProducts = async (query: string): Promise<FeaturedItem[]> => {
    const response = await api.get(`/api/products/search?q=${query}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(transformProduct);
};

export const getProductsByUser = async (userId: string): Promise<FeaturedItem[]> => {
    const response = await api.get(`/api/products/user/${userId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(transformProduct);
};

export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`/api/products/${id}`);
};

export const createProduct = async (productData: any): Promise<{ id: string }> => {
    const response = await api.post('/api/products', productData);
    return response.data;
};

export const updateProduct = async (id: string, productData: any): Promise<void> => {
    await api.put(`/api/products/${id}`, productData);
};
