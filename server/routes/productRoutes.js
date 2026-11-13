import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, requireRole('farmer', 'admin'), createProduct);
router.put('/:id', verifyToken, requireRole('farmer', 'admin'), updateProduct);
router.delete('/:id', verifyToken, requireRole('farmer', 'admin'), deleteProduct);

export default router;

