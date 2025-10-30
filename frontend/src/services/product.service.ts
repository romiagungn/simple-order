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
   console.log('Get products');
   const response = await api.get<IApiResponse<IProduct[]>>('/products');
   console.log('Get products response:', response);
   return response.data.responseData;
};

export const addProduct = async (payload: IAddProductPayload) => {
   console.log('Add product payload:', payload);
   const response = await api.post<IApiResponse<IProduct>>('/products', payload);
   console.log('Add product response:', response);
   return response.data;
};
