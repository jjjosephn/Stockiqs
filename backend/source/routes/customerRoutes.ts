import { Router } from 'express';
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from '../controllers/customerController';

const router = Router();

router.get('/:userId', getCustomers);
router.get('/:userId/:customerId', getCustomer);
router.post('/', createCustomer);
router.delete('/:customerId', deleteCustomer);
router.put('/:customerId', updateCustomer);

export default router;