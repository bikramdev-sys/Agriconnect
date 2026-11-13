import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { optionalVerifyToken, verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalVerifyToken, getOrders);
router.post('/', createOrder);
router.put('/:id/status', verifyToken, requireRole('farmer', 'admin'), updateOrderStatus);

export default router;

