import api from './client';

export interface BookingData {
    product_id: string;
    product_name: string;
    user_email?: string;
    payment_method: string;
    total_price: any;
    status?: string;
    settlement_status?: string;
    commission_amount?: number;
    settled_amount?: number;
    settled_at?: string;
}

export const createBooking = async (booking: BookingData) => {
    const response = await api.post('/api/bookings', booking);
    return response.data;
};

export interface BookingFilter {
    status?: string;
    payment_method?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    seller_id?: string;
    buyer_email?: string;
}

export const getBookings = async (filter?: BookingFilter) => {
    const response = await api.get('/api/bookings', { params: filter });
    return response.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
    const response = await api.patch(`/api/bookings/${id}/status`, { status });
    return response.data;
};

export const settleBooking = async (id: string, total_price: number) => {
    const response = await api.post(`/api/bookings/${id}/settle`, { total_price });
    return response.data;
};

export const requestSettlement = async (id: string) => {
    const response = await api.post(`/api/bookings/${id}/request-settlement`);
    return response.data;
};

export const deleteBooking = async (id: string) => {
    await api.delete(`/api/bookings/${id}`);
    return true;
};
