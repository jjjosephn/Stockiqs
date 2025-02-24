import { Router } from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct, updateProductStock, deleteProductStock, updateProductStockAfterSale, deleteProductStockAfterSale, getProductsArchive } from '../controllers/productController';

const router = Router();

router.get('/:userId', getProducts);
router.get('/archive', getProductsArchive);
router.post('/', createProduct);
router.delete('/:productId', deleteProduct);
router.put('/:productId', updateProduct);
router.post('/:productId/stock', updateProductStock);
router.delete('/:productId/stock/:stockId', deleteProductStock);
router.post('/stock/:stockId', updateProductStockAfterSale);
router.delete('/stock/:stockId', deleteProductStockAfterSale);

export default router;