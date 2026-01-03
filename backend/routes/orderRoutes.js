const express = require('express');
const router = express.Router();
const {
    placeOrder, getBuyerOrders, getFarmerOrders,
    createRequest, getBuyerRequests, getFarmerRequests, updateRequestStatus, processPayment
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Existing Routes (Legacy Support)
router.post('/', authMiddleware, placeOrder);
router.get('/buyer', authMiddleware, getBuyerOrders);
router.get('/farmer', authMiddleware, getFarmerOrders);

// NEW Routes for Negotiation & Payment
router.post('/request', authMiddleware, createRequest); // Buyer sends request
router.get('/requests/buyer', authMiddleware, getBuyerRequests); // Buyer views status
router.get('/requests/farmer', authMiddleware, getFarmerRequests); // Farmer views incoming
router.put('/request/:id/status', authMiddleware, updateRequestStatus); // Farmer accepts/rejects
router.put('/request/:id/pay', authMiddleware, processPayment); // Buyer pays

module.exports = router;
