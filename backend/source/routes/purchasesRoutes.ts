import { Router } from 'express';
import { getPurchases } from '../controllers/purchasesController';

const router = Router();

router.get('/:userId', getPurchases)

export default router;