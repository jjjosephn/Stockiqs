import { Router } from 'express';
import { getPurchases } from '../controllers/purchasesController';

const router = Router();

router.get('/', getPurchases)

export default router;