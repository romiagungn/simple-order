import { pool } from '@/lib/db';

export const findUserByEmail = async (email: string) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    console.log('service user by email', result.rows);
    return result.rows[0];
};

export const createUser = async (email: string, hashedPassword: string) => {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
    const result = await pool.query(query, [email, hashedPassword]);
    console.log('service create user', result.rows);
    return result.rows[0];
};