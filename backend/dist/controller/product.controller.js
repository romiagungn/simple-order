"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const db_1 = require("@/lib/db");
const getProducts = async (req, res) => {
    try {
        const queryText = `
      SELECT * FROM products 
      WHERE stock > 0 
      ORDER BY created_at DESC
    `;
        const result = await db_1.pool.query(queryText);
        const products = result.rows;
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Gagal mengambil data produk.' });
    }
};
exports.getProducts = getProducts;
//# sourceMappingURL=product.controller.js.map