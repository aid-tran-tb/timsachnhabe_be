// models/order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_books', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: { 
    type: String,
    required: true,
  },
  paymentMethod: { 
    type: String,
    required: true,
  },
  shippingAddress: { 
    type: String,
    required: true,
  },
  status: { 
    type: String,
    required: true,
  },
  createdAt: { 
    type: String,
    required: true,
  },
  updatedAt: { 
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("orders", orderSchema);
