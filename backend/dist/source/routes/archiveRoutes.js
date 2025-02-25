"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archiveController_1 = require("../controllers/archiveController");
const router = (0, express_1.Router)();
router.get('/', archiveController_1.getProductsArchive);
exports.default = router;
