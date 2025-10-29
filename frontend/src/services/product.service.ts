import api from '../lib/api';

interface IApiResponse<T> {
   code: number;
   responseCode: string;
   responseMessage: string;
   responseData: T;
}

export interface IProduct {
   id: string;
   name: string;
   price: number;
   stock: number;
   created_at: string;
}

export interface IAddProductPayload {
   name: string;
   price: number;
   stock: number;
}

export const getProducts = async () => {
   const response = await api.get<IApiResponse<IProduct[]>>('/products');
   return response.data.responseData;
};

export const addProduct = async (payload: IAddProductPayload) => {
   const response = await api.post<IApiResponse<IProduct>>('/products', payload);
   return response.data;
};
