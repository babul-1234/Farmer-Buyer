const express = require('express');
const router = express.Router();
const { addReview, getFarmerReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addReview);
router.get('/farmer/:id', authMiddleware, getFarmerReviews);

module.exports = router;
