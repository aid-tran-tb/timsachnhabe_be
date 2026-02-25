// models/invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  orderDate: { type: String, required: true },
  paymentDate: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  productTotal: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true }
});

module.exports = mongoose.model('invoices', invoiceSchema);
