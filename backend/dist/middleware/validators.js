"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateOrder = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email harus valid.'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password tidak boleh kosong.'),
    handleValidationErrors,
];
exports.validateCreateOrder = [
    (0, express_validator_1.body)('items')
        .isArray({ min: 1 })
        .withMessage('Pesanan harus memiliki minimal 1 item.'),
    (0, express_validator_1.body)('items.*.productId')
        .isString()
        .notEmpty()
        .withMessage('Setiap item harus memiliki productId.'),
    (0, express_validator_1.body)('items.*.quantity')
        .isInt({ gt: 0 })
        .withMessage('Kuantitas (quantity) harus angka positif.'),
    handleValidationErrors,
];
//# sourceMappingURL=validators.js.map