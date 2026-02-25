// models/coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  promoID: { type: String, required: true, unique: true },
  promoName: { type: String, required: true },
  promoType: { type: String, required: true },
  amount: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  Description: { type: String }
});

module.exports = mongoose.model('coupons', couponSchema);
