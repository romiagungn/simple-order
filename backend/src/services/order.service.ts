import { pool } from '@/lib/db';
import { PoolClient } from 'pg';
import * as productService from './product.service';

type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};

type OrderItemInput = {
    productId: string;
    quantity: number;
};

export const createOrderTransaction = async (userId: string, items: OrderItemInput[]) => {
    const client: PoolClient = await pool.connect();

    try {
        await client.query('BEGIN');

        const productIds = items.map((item) => item.productId);
        const products: Product[] = await productService.getProductsByIds(productIds, client);

        const productMap = new Map<string, Product>(products.map((p) => [p.id, p]));

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Stok untuk produk '${product.name}' tidak mencukupi (tersisa: ${product.stock}).`);
            }

            const priceAtTime = product.price;
            totalAmount += priceAtTime * item.quantity;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtTime: priceAtTime,
            });
        }

        const orderInsertQuery = 'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id';
        const orderResult = await client.query(orderInsertQuery, [userId, totalAmount]);
        const orderId = orderResult.rows[0].id;

        const itemInsertQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)';
        for (const item of orderItemsData) {
            await client.query(itemInsertQuery, [
                orderId,
                item.productId,
                item.quantity,
                item.priceAtTime,
            ]);
        }

        const stockUpdateQuery = 'UPDATE products SET stock = stock - $1 WHERE id = $2';
        for (const item of items) {
            await client.query(stockUpdateQuery, [item.quantity, item.productId]);
        }

        await client.query('COMMIT');

        return { orderId };

    } catch (error: any) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getHistoryByUserId = async (userId: string) => {
    const queryText = `
    SELECT 
      o.id, 
      o.total_amount, 
      o.created_at,
      COALESCE(
        (
          SELECT json_agg(json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'priceAtTime', oi.price_at_time,
            'product', json_build_object('id', p.id, 'name', p.name)
          ))
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ), '[]'::json
      ) as items
    FROM orders o
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
  `;

    const result = await pool.query(queryText, [userId]);
    return result.rows;
};