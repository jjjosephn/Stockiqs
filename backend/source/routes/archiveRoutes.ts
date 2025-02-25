import { Router } from 'express';
import { getProductsArchive } from '../controllers/archiveController';

const router = Router()

router.get('/', getProductsArchive);

export default router;
