import { Router } from 'express';
import { createCustomer, getCustomers } from '../controllers/customerController';

const router = Router();

router.get('/', getCustomers);
router.post('/', createCustomer);

export default router;