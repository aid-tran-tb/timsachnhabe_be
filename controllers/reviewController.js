const Review = require('../models/review');

// Lấy tất cả reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu reviews' });
    }
};

// Lấy review theo ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Không tìm thấy review' });
        }
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu review' });
    }
};

// Tạo review mới
exports.createReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi khi tạo review' });
    }
};

// Cập nhật review
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ error: 'Không tìm thấy review' });
        }
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi khi cập nhật review' });
    }
};

// Xóa review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Không tìm thấy review' });
        }
        res.json({ message: 'Đã xóa review thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa review' });
    }
}; 