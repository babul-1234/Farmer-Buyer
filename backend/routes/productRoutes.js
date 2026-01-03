const express = require('express');
const router = express.Router();
const { getAllProducts, getMyProducts, addProduct, deleteProduct, getPriceSuggestion } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/my-products', authMiddleware, getMyProducts);
router.get('/price-suggestion', authMiddleware, getPriceSuggestion);
router.post('/', authMiddleware, addProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
