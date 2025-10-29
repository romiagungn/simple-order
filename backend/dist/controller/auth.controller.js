"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("@/lib/db");
const login = async (req, res) => {
    const { email, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('FATAL ERROR: JWT_SECRET tidak terdefinisi di file .env');
        return res.status(500).json({ message: 'Kesalahan konfigurasi server internal.' });
    }
    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const result = await db_1.pool.query(userQuery, [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Kredensial tidak valid.' });
        }
        const isPasswordValid = await (0, bcryptjs_1.compare)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Kredensial tidak valid.' });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('FATAL ERROR: JWT_SECRET tidak terdefinisi di file .env');
            return res.status(500).json({ message: 'Kesalahan konfigurasi server internal.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
        res.status(200).json({
            message: 'Login berhasil.',
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat login.' });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map