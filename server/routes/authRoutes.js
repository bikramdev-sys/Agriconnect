import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public user registration (Farmer & Buyer)
router.post('/register', register);

// Public user login (Farmer & Buyer)
router.post('/login', login);

// Current user profile
router.get('/me', verifyToken, getMe);

export default router;

