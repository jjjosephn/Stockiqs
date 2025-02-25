import { Router } from 'express';
import { getSales, newSale } from '../controllers/salesController';

const router = Router();

router.post('/', newSale);
router.get('/:userId', getSales);

export default router;