import { Router } from 'express';
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from '../controllers/customerController';

const router = Router();

router.get('/', getCustomers);
router.get('/:customerId', getCustomer);
router.post('/', createCustomer);
router.delete('/:customerId', deleteCustomer);
router.put('/:customerId', updateCustomer);

export default router;