// index.js
require('dotenv').config(); // Load biến môi trường từ .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

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
    .then(() => {
      console.log('✅ Đã kết nối MongoDB thành công!');
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
