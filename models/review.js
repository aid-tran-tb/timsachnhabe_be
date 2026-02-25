// models/review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String },
  bookId: { type: Number, required: true }
});

module.exports = mongoose.model('reviews', reviewSchema);
