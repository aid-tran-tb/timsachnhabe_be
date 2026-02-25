// models/product_book.js
const mongoose = require('mongoose');

const productBookSchema = new mongoose.Schema({
  ISBN: { type: Number, required: true, unique: true },
  bookTitle: { type: String, required: true },
  publisher: { type: String, required: true },
  author: { type: String, required: true },
  pageCount: { type: Number, required: true },
  bookWeight: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  catalog: { type: String, required: true },
  soldCount: { type: Number, default: 0 },
  stock: { type: Number, default: 0, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product_books', productBookSchema);
