import { pool } from '@/lib/db';
import { PoolClient } from 'pg';

type DBClient = PoolClient | typeof pool;

export type NewProductData = {
   name: string;
   price: number;
   stock: number;
};

export const getAllProducts = async () => {
   const queryText = `
    SELECT * FROM products 
    WHERE stock > 0 
    ORDER BY created_at DESC
  `;
   const result = await pool.query(queryText);
   return result.rows;
};

export const getProductsByIds = async (productIds: string[], client: DBClient = pool) => {
   const query = 'SELECT * FROM products WHERE id = ANY($1::uuid[]) FOR UPDATE';
   const result = await client.query(query, [productIds]);
   return result.rows;
};

export const createProduct = async (data: NewProductData) => {
   const { name, price, stock } = data;
   const query = `
    INSERT INTO products (name, price, stock) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
   const result = await pool.query(query, [name, price, stock]);
   return result.rows[0];
};
