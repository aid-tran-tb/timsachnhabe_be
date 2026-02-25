const Coupon = require('../models/coupon');

// Validate coupon
exports.validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({ code });
        
        if (!coupon) {
            return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
        }

        // Check if coupon is expired
        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
        }

        // Check if coupon is still valid
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
        }

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get coupon by ID
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
        }
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new coupon
exports.createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        const savedCoupon = await coupon.save();
        res.status(201).json(savedCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!coupon) {
            return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
        }
        res.json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
        }
        res.json({ message: 'Đã xóa mã giảm giá thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get customer coupons
exports.getCustomerCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ customerId: req.params.customerId });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 