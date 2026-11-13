import express from 'express';
import dataStore from '../storage/dataStore.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const farmers = await dataStore.getFarmers();
    return res.json({ success: true, count: farmers.length, farmers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch farmers directory.' });
  }
});

export default router;

