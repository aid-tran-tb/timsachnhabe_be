// index.js
require('dotenv').config(); // Load biến môi trường từ .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('./models/user');
const ProductBook = require('./models/product_book');
const Catalog = require('./models/catalog');
const Coupon = require('./models/coupon');
const Invoice = require('./models/invoice');
const Order = require('./models/order');
const Review = require('./models/review');

// Import routes
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const couponRoutes = require('./routes/couponRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.SERVER_URI_MONGODB;

// Khởi tạo dữ liệu mẫu cho các bảng
const initializeDatabase = async () => {
  try {
    const [
      userCount,
      productCount,
      catalogCount,
      couponCount,
      invoiceCount,
      orderCount,
      reviewCount,
    ] = await Promise.all([
      User.countDocuments(),
      ProductBook.countDocuments(),
      Catalog.countDocuments(),
      Coupon.countDocuments(),
      Invoice.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
    ]);

    if (
      userCount > 0 ||
      productCount > 0 ||
      catalogCount > 0 ||
      couponCount > 0 ||
      invoiceCount > 0 ||
      orderCount > 0 ||
      reviewCount > 0
    ) {
      console.log('ℹ️ Đã có dữ liệu, bỏ qua tạo dữ liệu mẫu');
      return;
    }

    const catalogsSeed = [
      { genreID: 'FIC', genre2nd: 'Tiểu thuyết' },
      { genreID: 'EDU', genre2nd: 'Giáo dục' },
      { genreID: 'KID', genre2nd: 'Thiếu nhi' },
    ];

    const productsSeed = [
      {
        ISBN: 9786041234567,
        bookTitle: 'Dế Mèn Phiêu Lưu Ký',
        publisher: 'NXB Kim Đồng',
        author: 'Tô Hoài',
        pageCount: 200,
        bookWeight: '250g',
        price: 60000,
        description: 'Tác phẩm kinh điển thiếu nhi Việt Nam',
        imageUrl: '/images/de-men-phieu-luu-ky.jpg',
        catalog: 'KID',
        soldCount: 0,
        stock: 100,
      },
      {
        ISBN: 9786049876543,
        bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        publisher: 'NXB Trẻ',
        author: 'Rosie Nguyễn',
        pageCount: 280,
        bookWeight: '300g',
        price: 90000,
        description: 'Sách kỹ năng sống dành cho người trẻ',
        imageUrl: '/images/tuoi-tre-dang-gia-bao-nhieu.jpg',
        catalog: 'EDU',
        soldCount: 0,
        stock: 80,
      },
      {
        ISBN: 9786049999999,
        bookTitle: 'Nhà Giả Kim',
        publisher: 'NXB Hội Nhà Văn',
        author: 'Paulo Coelho',
        pageCount: 220,
        bookWeight: '260g',
        price: 85000,
        description: 'Tiểu thuyết truyền cảm hứng nổi tiếng thế giới',
        imageUrl: '/images/nha-gia-kim.jpg',
        catalog: 'FIC',
        soldCount: 0,
        stock: 60,
      },
    ];

    const passwordSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', passwordSalt);

    const usersSeed = [
      {
        fullName: 'Admin Tim Sach Nha Be',
        email: 'admin@timsachnhabe.com',
        password: hashedPassword,
        phoneNumber: '0900000001',
        address: 'Nhà Bè, TP. Hồ Chí Minh',
        role: 'admin',
      },
      {
        fullName: 'Người Dùng 1',
        email: 'user1@timsachnhabe.com',
        password: hashedPassword,
        phoneNumber: '0900000002',
        address: 'Quận 1, TP. Hồ Chí Minh',
        role: 'user',
      },
      {
        fullName: 'Người Dùng 2',
        email: 'user2@timsachnhabe.com',
        password: hashedPassword,
        phoneNumber: '0900000003',
        address: 'Quận 7, TP. Hồ Chí Minh',
        role: 'user',
      },
    ];

    await Catalog.insertMany(catalogsSeed);
    console.log('✅ Sample catalogs created');

    const createdProducts = await ProductBook.insertMany(productsSeed);
    console.log('✅ Sample products created');

    const createdUsers = await User.insertMany(usersSeed);
    console.log('✅ Sample users created');

    const baseUser = createdUsers[1] || createdUsers[0];
    const secondUser = createdUsers[2] || createdUsers[0];

    const orderDate = new Date().toISOString();

    const ordersSeed = [
      {
        userId: baseUser._id,
        products: [
          {
            productId: createdProducts[0]._id,
            quantity: 1,
          },
          {
            productId: createdProducts[1]._id,
            quantity: 2,
          },
        ],
        totalAmount:
          createdProducts[0].price * 1 + createdProducts[1].price * 2,
        orderDate,
        paymentMethod: 'COD',
        shippingAddress: baseUser.address,
        status: 'pending',
        createdAt: orderDate,
        updatedAt: orderDate,
      },
      {
        userId: secondUser._id,
        products: [
          {
            productId: createdProducts[2]._id,
            quantity: 1,
          },
        ],
        totalAmount: createdProducts[2].price,
        orderDate,
        paymentMethod: 'VNPAY',
        shippingAddress: secondUser.address,
        status: 'completed',
        createdAt: orderDate,
        updatedAt: orderDate,
      },
    ];

    const createdOrders = await Order.insertMany(ordersSeed);

    console.log('✅ Sample orders created');

    const invoicesSeed = createdOrders.map((order, index) => ({
      orderId: order._id.toString(),
      orderDate: order.orderDate,
      paymentDate: order.orderDate,
      fullName: index === 0 ? baseUser.fullName : secondUser.fullName,
      email: index === 0 ? baseUser.email : secondUser.email,
      productTotal: order.totalAmount,
      discountAmount: index === 0 ? 10000 : 0,
      finalAmount: index === 0 ? order.totalAmount - 10000 : order.totalAmount,
      paymentMethod: order.paymentMethod,
    }));

    await Invoice.insertMany(invoicesSeed);
    console.log('✅ Sample invoices created');

    const couponsSeed = [
      {
        promoID: 'WELCOME10',
        promoName: 'Giảm 10% cho đơn đầu tiên',
        promoType: 'percent',
        amount: '10',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        Description: 'Áp dụng cho tất cả khách hàng mới',
      },
      {
        promoID: 'FREESHIP',
        promoName: 'Miễn phí vận chuyển',
        promoType: 'shipping',
        amount: '0',
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        Description: 'Miễn phí vận chuyển cho đơn từ 200k',
      },
    ];

    await Coupon.insertMany(couponsSeed);
    console.log('✅ Sample coupons created');

    const reviewsSeed = [
      {
        rating: 5,
        comment: 'Sách rất hay, đáng đọc',
        bookId: createdProducts[0].ISBN,
      },
      {
        rating: 4,
        comment: 'Nội dung hữu ích cho người trẻ',
        bookId: createdProducts[1].ISBN,
      },
    ];

    await Review.insertMany(reviewsSeed);
    console.log('✅ Sample reviews created');

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

// Cấu hình kết nối MongoDB với cơ chế tự động reconnect
const connectWithRetry = () => {
  console.log('🔄 Đang kết nối đến MongoDB...');
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout sau 5s nếu không kết nối được
      socketTimeoutMS: 45000, // Đóng socket sau 45s không hoạt động
    })
    .then(async () => {
      console.log('✅ Đã kết nối MongoDB thành công!');
      await initializeDatabase();
    })
    .catch((err) => {
      console.error('❌ Kết nối MongoDB thất bại:', err.message);
      console.log('⏱️ Thử kết nối lại sau 5 giây...');
      setTimeout(connectWithRetry, 5000); // Thử lại sau 5 giây
    });
};

// Xử lý sự kiện kết nối MongoDB
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose đã kết nối');
});

mongoose.connection.on('error', (err) => {
  console.error('🔌 Mongoose lỗi kết nối:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose đã ngắt kết nối');
  connectWithRetry(); // Thử kết nối lại khi bị ngắt
});

// Xử lý khi ứng dụng đóng để đóng kết nối MongoDB
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Kết nối MongoDB đã đóng do ứng dụng kết thúc');
  process.exit(0);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(
  '/api-docs',
  express.static(path.join(__dirname, 'public', 'api-docs'))
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);

// Thông tin cơ bản của server
app.get('/', (req, res) => {
  const baseUrl = process.env.URL_DEPLOYMENT || `http://localhost:${PORT}`;

  res.json({
    message: 'Tim Sach Nha Be API',
    serverUrl: baseUrl,
    apiDocs: `${baseUrl}/api-docs`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Khởi tạo kết nối MongoDB
connectWithRetry();

// Khởi động server
app.listen(PORT, () => {
  console.log(
    `🚀 Server đang chạy tại ${
      process.env.URL_DEPLOYMENT || `http://localhost:${PORT}`
    }`
  );
  console.log(
    `📚 API Documentation: ${
      process.env.URL_DEPLOYMENT || `http://localhost:${PORT}`
    }/api-docs`
  );
});
