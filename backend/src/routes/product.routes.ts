import { Router } from 'express';
import { protect } from '@/middleware/auth.middleware';
import { createProduct, getProducts } from '@/controller/product.controller';
import { validateCreateProduct } from '@/middleware/validators';

const router = Router();

router.get('/', protect, getProducts);

router.post('/', protect, validateCreateProduct, createProduct);

export default router;
