import express from 'express';
import {
  adminLogin,
  getStats,
  getAllUsers,
  toggleFarmerVerification,
  deleteFarmer,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Hidden Admin Authentication
router.post('/auth/login', adminLogin);

// Protected Admin Operations
router.get('/stats', verifyToken, requireAdmin, getStats);
router.get('/users', verifyToken, requireAdmin, getAllUsers);
router.put('/farmers/:id/verify', verifyToken, requireAdmin, toggleFarmerVerification);
router.delete('/farmers/:id', verifyToken, requireAdmin, deleteFarmer);

// Settings
router.get('/settings', getSettings);
router.put('/settings', verifyToken, requireAdmin, updateSettings);

export default router;

