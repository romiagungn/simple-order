import api from '../lib/api';

interface IApiResponse<T> {
    code: number;
    responseCode: string;
    responseMessage: string;
    responseData: T;
}

export interface ICreateOrderPayload {
    items: {
        productId: string;
        quantity: number;
    }[];
}

type IOrderSuccessData = {
    orderId: string;
};

export interface IOrderHistoryItem {
    id: string;
    quantity: number;
    priceAtTime: number;
    product: {
        id: string;
        name: string;
    };
}

export interface IOrderHistory {
    id: string;
    total_amount: number;
    created_at: string;
    items: IOrderHistoryItem[];
}

export const createOrder = async (payload: ICreateOrderPayload) => {
    const response = await api.post<IApiResponse<IOrderSuccessData>>('/orders', payload);
    return response.data;
};

export const getOrderHistory = async () => {
    const response = await api.get<IApiResponse<IOrderHistory[]>>('/orders');
    return response.data.responseData;
};