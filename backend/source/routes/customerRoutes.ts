import { Router } from 'express';
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from '../controllers/customerController';

const router = Router();

router.get('/', getCustomers);
router.get('/:userId', getCustomer);
router.post('/', createCustomer);
router.delete('/:userId', deleteCustomer);
router.put('/:userId', updateCustomer);

export default router;