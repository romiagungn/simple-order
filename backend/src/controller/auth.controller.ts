import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { sendApiResponse, ApiResponseCode } from '@/lib/response.util';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log("Login payload:", req.body);

    const jwtSecret: Secret | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('FATAL ERROR: JWT_SECRET tidak terdefinisi di file .env');
        return sendApiResponse(res, 500, ApiResponseCode.INTERNAL_ERROR, 'Kesalahan konfigurasi server internal.');
    }

    try {
        const user = await authService.findUserByEmail(email);

        if (!user) {
            return sendApiResponse(res, 401, ApiResponseCode.UNAUTHORIZED, 'Kredensial tidak valid.');
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return sendApiResponse(res, 401, ApiResponseCode.UNAUTHORIZED, 'Kredensial tidak valid.');
        }

        // @ts-ignore
        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        const responseData = {
            token,
            user: { id: user.id, email: user.email },
        };

        return sendApiResponse(res, 200, ApiResponseCode.SUCCESS, 'Login berhasil.', responseData);

    } catch (error) {
        console.error('Login error:', error);
        return sendApiResponse(res, 500, ApiResponseCode.INTERNAL_ERROR, 'Terjadi kesalahan pada server saat login.');
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const jwtSecret: Secret | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('FATAL ERROR: JWT_SECRET tidak terdefinisi di file .env');
        return sendApiResponse(res, 500, ApiResponseCode.INTERNAL_ERROR, 'Kesalahan konfigurasi server internal.');
    }

    try {
        const existingUser = await authService.findUserByEmail(email);

        if (existingUser) {
            return sendApiResponse(res, 400, ApiResponseCode.BAD_REQUEST, 'Email sudah terdaftar.');
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await authService.createUser(email, hashedPassword);

        // @ts-ignore
        const token = jwt.sign(
            { userId: newUser.id },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        const responseData = {
            token,
            user: { id: newUser.id, email: newUser.email },
        };

        return sendApiResponse(res, 201, ApiResponseCode.CREATED, 'Registrasi berhasil.', responseData);

    } catch (error) {
        console.error('Register error:', error);
        return sendApiResponse(res, 500, ApiResponseCode.INTERNAL_ERROR, 'Terjadi kesalahan pada server saat registrasi.');
    }
};