"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("@/middleware/validators");
const auth_controller_1 = require("@/controller/auth.controller");
const router = (0, express_1.Router)();
router.post('/login', validators_1.validateLogin, auth_controller_1.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map