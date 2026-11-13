import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getOrders);
router.post('/', createOrder);
router.put('/:id/status', verifyToken, requireRole('farmer', 'admin'), updateOrderStatus);

export default router;

