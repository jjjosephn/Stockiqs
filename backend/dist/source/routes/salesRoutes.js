"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesController_1 = require("../controllers/salesController");
const router = (0, express_1.Router)();
router.post('/', salesController_1.newSale);
exports.default = router;
