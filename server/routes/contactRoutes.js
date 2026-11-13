import express from 'express';
import {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', verifyToken, requireAdmin, getContacts);
router.patch('/:id/status', verifyToken, requireAdmin, updateContactStatus);
router.delete('/:id', verifyToken, requireAdmin, deleteContact);

export default router;

