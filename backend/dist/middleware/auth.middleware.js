"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("@/lib/db");
const protect = async (req, res, next) => {
    let token;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('FATAL ERROR: JWT_SECRET tidak terdefinisi di file .env');
        return res.status(500).json({ message: 'Kesalahan konfigurasi server internal.' });
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            const userQuery = 'SELECT id FROM users WHERE id = $1';
            const result = await db_1.pool.query(userQuery, [decoded.userId]);
            const user = result.rows[0];
            if (!user) {
                return res.status(401).json({ message: 'User tidak ditemukan, autentikasi gagal.' });
            }
            req.user = { id: user.id };
            next();
        }
        catch (error) {
            console.error('Error verifikasi token:', error);
            return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Tidak ada token, akses ditolak.' });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.middleware.js.map