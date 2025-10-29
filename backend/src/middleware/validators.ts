import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   next();
};

export const validateLogin = [
   body('email').isEmail().withMessage('Email harus valid.'),
   body('password').notEmpty().withMessage('Password tidak boleh kosong.'),
   handleValidationErrors,
];

export const validateRegister = [
   body('email').isEmail().normalizeEmail().withMessage('Email harus valid.'),
   body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
   handleValidationErrors,
];

export const validateCreateProduct = [
   body('name').notEmpty().withMessage('Nama produk tidak boleh kosong.'),
   body('price').isFloat({ gt: 0 }).withMessage('Harga harus angka positif.'),
   body('stock').isInt({ gt: 0 }).withMessage('Stok harus angka bulat positif.'),
   handleValidationErrors,
];

export const validateCreateOrder = [
   body('items').isArray({ min: 1 }).withMessage('Pesanan harus memiliki minimal 1 item.'),
   body('items.*.productId')
      .isString()
      .notEmpty()
      .withMessage('Setiap item harus memiliki productId.'),
   body('items.*.quantity')
      .isInt({ gt: 0 })
      .withMessage('Kuantitas (quantity) harus angka positif.'),
   handleValidationErrors,
];
