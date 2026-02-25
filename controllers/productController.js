const Product = require('../models/product_book');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
        const limit = parseInt(req.query.limit) || 10; // Mặc định 10 sách mỗi trang
        const skip = (page - 1) * limit;

        // Đếm tổng số sách để tính tổng số trang
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy danh sách sách với phân trang
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        // Trả về kết quả bao gồm thông tin phân trang
        res.json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({ 
            error: 'Lỗi khi lấy danh sách sách',
            details: error.message 
        });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search products
exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get products by catalog
exports.getProductsByCatalog = async (req, res) => {
    try {
        const catalogName = req.params.catalog;
        
        // Tìm sách theo tên catalog thay vì ID
        const products = await Product.find({ catalog: catalogName });
        
        res.json(products);
    } catch (error) {
        console.error('Error in getProductsByCatalog:', error);
        res.status(500).json({ 
            error: 'Lỗi khi lấy danh sách sách theo danh mục',
            details: error.message 
        });
    }
};

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ message: 'Đã xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update stock
exports.updateStock = async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { stock: quantity } },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get top 5 best-selling products
exports.getTopSellingProducts = async (req, res) => {
    try {
        // Lấy số lượng sản phẩm muốn hiển thị (mặc định là 5)
        const limit = parseInt(req.query.limit) || 5;
        
        // Kiểm tra xem có sản phẩm nào có soldCount > 0 không
        const hasProductsWithSales = await Product.exists({ soldCount: { $gt: 0 } });
        
        let topProducts;
        
        if (hasProductsWithSales) {
            // Nếu có sản phẩm đã bán, sắp xếp theo soldCount
            topProducts = await Product.find({ soldCount: { $gt: 0 } })
                .sort({ soldCount: -1 })
                .limit(limit);
        } else {
            // Nếu chưa có sản phẩm nào được bán, trả về sản phẩm mới nhất
            topProducts = await Product.find()
                .sort({ createdAt: -1 })
                .limit(limit);
        }
            
        res.json(topProducts);
    } catch (error) {
        console.error('Error in getTopSellingProducts:', error);
        res.status(500).json({
            error: 'Lỗi khi lấy danh sách sản phẩm bán chạy',
            details: error.message
        });
    }
}; 