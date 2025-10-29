import { Router } from 'express';
import authRouter from './auth.routes';
import productRouter from './product.routes';
import orderRouter from './order.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);

export default router;
