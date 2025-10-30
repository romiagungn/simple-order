import { pool } from '@/lib/db';
import { PoolClient } from 'pg';

type DBClient = PoolClient | typeof pool;

export type NewProductData = {
   name: string;
   price: number;
   stock: number;
};

export const getAllProducts = async () => {
   console.log('service get all product');
   const queryText = `
    SELECT * FROM products 
    WHERE stock > 0 
    ORDER BY created_at DESC
  `;
   const result = await pool.query(queryText);
   console.log('service get all product', result.rows);
   return result.rows;
};

export const getProductsByIds = async (productIds: string[], client: DBClient = pool) => {
   console.log('service get product by id', productIds);
   const query = 'SELECT * FROM products WHERE id = ANY($1::uuid[]) FOR UPDATE';
   const result = await client.query(query, [productIds]);
    console.log('service get product by id', result.rows);
   return result.rows;
};

export const createProduct = async (data: NewProductData) => {
   const { name, price, stock } = data;
   console.log('service create product', data);
   const query = `
    INSERT INTO products (name, price, stock) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
   const result = await pool.query(query, [name, price, stock]);
    console.log('service create product', result.rows);
   return result.rows[0];
};
