"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("@/middleware/auth.middleware");
const order_controller_1 = require("@/controller/order.controller");
const validators_1 = require("@/middleware/validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/', order_controller_1.getOrderHistory);
router.post('/', validators_1.validateCreateOrder, order_controller_1.createOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map