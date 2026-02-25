const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get order statistics
router.get('/statistics', orderController.getOrderStatistics);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Create new order
router.post('/', orderController.createOrder);

// Update order
router.put('/:id', orderController.updateOrder);

// Delete order
router.delete('/:id', orderController.deleteOrder);

module.exports = router; 