import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { pool } from '@/lib/db';
import { sendApiResponse, ApiResponseCode } from '@/lib/response.util';

interface JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const jwtSecret: Secret | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('FATAL ERROR: JWT_SECRET tidak terdefinisi di file .env');
        return sendApiResponse(
            res,
            500,
            ApiResponseCode.INTERNAL_ERROR,
            'Kesalahan konfigurasi server internal.'
        );
    }

    const token = req.headers['token'] as string;

    if (!token) {
        return sendApiResponse(
            res,
            401,
            ApiResponseCode.UNAUTHORIZED,
            'Tidak ada token, akses ditolak.'
        );
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        const userQuery = 'SELECT id FROM users WHERE id = $1';
        const result = await pool.query(userQuery, [decoded.userId]);
        const user = result.rows[0];

        if (!user) {
            return sendApiResponse(
                res,
                401,
                ApiResponseCode.UNAUTHORIZED,
                'User tidak ditemukan, autentikasi gagal.'
            );
        }

        req.user = { id: user.id };
        next();
    } catch (error) {
        console.error('Error verifikasi token:', error);
        return sendApiResponse(
            res,
            401,
            ApiResponseCode.UNAUTHORIZED,
            'Token tidak valid atau kadaluarsa.'
        );
    }
};