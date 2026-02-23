import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByUser
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/user/:userId', getProductsByUser);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
