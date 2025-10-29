import { Router } from 'express';
import { protect } from "@/middleware/auth.middleware";
import { createOrder, getOrderHistory} from "@/controller/order.controller";
import { validateCreateOrder } from "@/middleware/validators";

const router = Router();

router.use(protect);

router.get('/', getOrderHistory);

router.post('/', validateCreateOrder, createOrder);

export default router;
