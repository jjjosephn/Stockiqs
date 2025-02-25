"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchasesController_1 = require("../controllers/purchasesController");
const router = (0, express_1.Router)();
router.get('/:userId', purchasesController_1.getPurchases);
exports.default = router;
