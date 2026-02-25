const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Get all reviews
router.get('/', reviewController.getAllReviews);

// Get review by ID
router.get('/:id', reviewController.getReviewById);

// Create new review
router.post('/', reviewController.createReview);

// Update review
router.put('/:id', reviewController.updateReview);

// Delete review
router.delete('/:id', reviewController.deleteReview);

module.exports = router; 