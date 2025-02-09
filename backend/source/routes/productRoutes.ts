import { Router } from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct, updateProductStock, deleteProductStock } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.delete('/:productId', deleteProduct);
router.put('/:productId', updateProduct);
router.post('/:productId/stock', updateProductStock);
router.delete('/:productId/stock/:stockId', deleteProductStock);

export default router;