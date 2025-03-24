//inventory-service/routes/productRoutes.js
const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/venue/:venueId', productController.getProductsByVenue);
router.put('/:id/stock', productController.updateStock);
router.post('/', productController.createProduct);

module.exports = router;