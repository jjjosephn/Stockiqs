import { Router } from 'express';
import { createOrUpdateUser } from '../controllers/userController';

const router = Router();

router.post('/', createOrUpdateUser);

export default router;