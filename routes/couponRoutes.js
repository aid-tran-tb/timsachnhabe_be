const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Public routes
router.get('/validate/:code', couponController.validateCoupon);

// All routes are now public
router.get('/', couponController.getAllCoupons);
router.get('/:id', couponController.getCouponById);
router.post('/', couponController.createCoupon);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);
router.get('/customer/:customerId', couponController.getCustomerCoupons);

module.exports = router; 