const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true // email dùng làm tên đăng nhập
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders'
    }
  ]
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Xuất model để dùng trong các module khác
module.exports = mongoose.model('User', userSchema);
