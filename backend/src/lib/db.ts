import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});

export const checkDbConnection = async () => {
    let client;
    try {
        client = await pool.connect();

        console.log('✅ Koneksi database PostgreSQL berhasil.');

    } catch (error) {
        console.error('Gagal terhubung ke database:', (error as Error).message);
        process.exit(1);
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

console.log('Koneksi pool database PostgreSQL berhasil diinisialisasi.');