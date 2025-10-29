import { Router } from 'express';
import { login, register } from "@/controller/auth.controller";
import { validateLogin, validateRegister } from "@/middleware/validators";

const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);

export default router;
