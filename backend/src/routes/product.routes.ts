import { Router } from 'express';
import { protect } from '@/middleware/auth.middleware';
import { getProducts } from '@/controller/product.controller';
import { validateCreateProduct } from '@/middleware/validators';
import { createProduct } from '@/services/product.service';

const router = Router();

router.get('/', protect, getProducts);

router.post('/', protect, validateCreateProduct, createProduct);

export default router;
