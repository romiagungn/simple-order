import { Request, Response } from 'express';
import { sendApiResponse, ApiResponseCode } from '@/lib/response.util';
import * as orderService from '../services/order.service';

type OrderItemInput = {
    productId: string;
    quantity: number;
};

export const createOrder = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { items } = req.body as { items: OrderItemInput[] };

    if (!userId) {
        return sendApiResponse(res, 401, ApiResponseCode.UNAUTHORIZED, 'User tidak terautentikasi.');
    }

    try {
        const { orderId } = await orderService.createOrderTransaction(userId, items);

        return sendApiResponse(
            res,
            201,
            ApiResponseCode.CREATED,
            'Pesanan berhasil dibuat.',
            { orderId: orderId }
        );

    } catch (error: any) {
        console.error('Create order error:', error);

        if (error.message.includes('Stok') || error.message.includes('Produk')) {
            return sendApiResponse(res, 400, ApiResponseCode.BAD_REQUEST, error.message);
        }

        return sendApiResponse(
            res,
            500,
            ApiResponseCode.INTERNAL_ERROR,
            'Gagal membuat pesanan.',
            { error: error.message }
        );
    }
};

export const getOrderHistory = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return sendApiResponse(res, 401, ApiResponseCode.UNAUTHORIZED, 'User tidak terautentikasi.');
    }

    try {
        const orders = await orderService.getHistoryByUserId(userId);

        return sendApiResponse(
            res,
            200,
            ApiResponseCode.SUCCESS,
            'Riwayat pesanan berhasil diambil.',
            orders
        );

    } catch (error) {
        console.error('Get order history error:', error);
        return sendApiResponse(
            res,
            500,
            ApiResponseCode.INTERNAL_ERROR,
            'Gagal mengambil riwayat pesanan.'
        );
    }
};