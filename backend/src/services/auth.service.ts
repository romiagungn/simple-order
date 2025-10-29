import { pool } from '@/lib/db';

export const findUserByEmail = async (email: string) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const createUser = async (email: string, hashedPassword: string) => {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
    const result = await pool.query(query, [email, hashedPassword]);
    return result.rows[0];
};