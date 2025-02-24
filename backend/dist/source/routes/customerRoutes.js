"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const router = (0, express_1.Router)();
router.get('/:userId', customerController_1.getCustomers);
router.get('/:userId/:customerId', customerController_1.getCustomer);
router.post('/', customerController_1.createCustomer);
router.delete('/:customerId', customerController_1.deleteCustomer);
router.put('/:customerId', customerController_1.updateCustomer);
exports.default = router;
