import { Response } from 'express';

export enum ApiResponseCode {
    SUCCESS = "SUCCESS",
    CREATED = "CREATED",
    BAD_REQUEST = "BAD_REQUEST",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    INTERNAL_ERROR = "INTERNAL_ERROR",
}

export interface IApiResponse<T = any> {
    code: number;
    responseCode: string;
    responseMessage: string;
    responseData: T | null;
}

export const sendApiResponse = <T>(
    res: Response,
    statusCode: number,
    responseCode: ApiResponseCode,
    message: string,
    data: T | null = null
) => {
    const response: IApiResponse<T> = {
        code: statusCode,
        responseCode: responseCode,
        responseMessage: message,
        responseData: data,
    };

    return res.status(statusCode).json(response);
};