"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderHistory = exports.createOrder = void 0;
const db_1 = require("@/lib/db");
const createOrder = async (req, res) => {
    const userId = req.user?.id;
    const { items } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'User tidak terautentikasi.' });
    }
    const client = await db_1.pool.connect();
    try {
        const productIds = items.map((item) => item.productId);
        const productQuery = 'SELECT * FROM products WHERE id = ANY($1::uuid[]) FOR UPDATE';
        const productResult = await client.query(productQuery, [productIds]);
        const products = productResult.rows;
        const productMap = new Map(products.map((p) => [p.id, p]));
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
        await client.query('BEGIN');
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
        res.status(201).json({ message: 'Pesanan berhasil dibuat.', orderId: orderId });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Gagal membuat pesanan.', error: error.message });
    }
    finally {
        client.release();
    }
};
exports.createOrder = createOrder;
const getOrderHistory = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User tidak terautentikasi.' });
    }
    try {
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
        const result = await db_1.pool.query(queryText, [userId]);
        const orders = result.rows;
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Get order history error:', error);
        res.status(500).json({ message: 'Gagal mengambil riwayat pesanan.' });
    }
};
exports.getOrderHistory = getOrderHistory;
//# sourceMappingURL=order.controller.js.map