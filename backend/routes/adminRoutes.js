const express = require('express');
const router = express.Router();
const { getSystemStats } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect admin routes
router.get('/stats', authMiddleware, getSystemStats);

module.exports = router;
