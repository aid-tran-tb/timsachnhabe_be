const Catalog = require('../models/catalog');

// Lấy tất cả catalog
exports.getAllCatalogs = async (req, res) => {
    try {
        const catalogs = await Catalog.find();
        res.json(catalogs);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu catalog' });
    }
};

// Lấy catalog theo ID
exports.getCatalogById = async (req, res) => {
    try {
        const catalog = await Catalog.findById(req.params.id);
        if (!catalog) {
            return res.status(404).json({ error: 'Không tìm thấy catalog' });
        }
        res.json(catalog);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu catalog' });
    }
};

// Tạo catalog mới
exports.createCatalog = async (req, res) => {
    try {
        const catalog = new Catalog(req.body);
        const savedCatalog = await catalog.save();
        res.status(201).json(savedCatalog);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi khi tạo catalog' });
    }
};

// Cập nhật catalog
exports.updateCatalog = async (req, res) => {
    try {
        const catalog = await Catalog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!catalog) {
            return res.status(404).json({ error: 'Không tìm thấy catalog' });
        }
        res.json(catalog);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi khi cập nhật catalog' });
    }
};

// Xóa catalog
exports.deleteCatalog = async (req, res) => {
    try {
        const catalog = await Catalog.findByIdAndDelete(req.params.id);
        if (!catalog) {
            return res.status(404).json({ error: 'Không tìm thấy catalog' });
        }
        res.json({ message: 'Đã xóa catalog thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa catalog' });
    }
}; 