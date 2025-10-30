import api from '../lib/api';

interface IApiResponse<T> {
   code: number;
   responseCode: string;
   responseMessage: string;
   responseData: T;
}

export type ILoginPayload = {
   email: string;
   password: string;
};
export type IRegisterPayload = ILoginPayload;

type IAuthSuccessData = {
   token: string;
   user: { id: string; email: string };
};

export const loginUser = async (payload: ILoginPayload) => {
   console.log("Login payload:", payload);
   const response = await api.post<IApiResponse<IAuthSuccessData>>('/auth/login', payload);
   console.log("Login response:", response);
   return response.data;
};

export const registerUser = async (payload: IRegisterPayload) => {
   console.log("Register payload:", payload);
   const response = await api.post<IApiResponse<IAuthSuccessData>>('/auth/register', payload);
   console.log("Register response:", response);
   return response.data;
};
