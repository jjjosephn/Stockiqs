import { Router } from 'express';
import { newSale } from '../controllers/salesController';

const router = Router();

router.post('/', newSale);

export default router;