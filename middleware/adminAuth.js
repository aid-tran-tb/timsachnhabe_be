module.exports = (req, res, next) => {
  // Giả sử user đã được xác thực và gán vào req.user
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Chỉ admin mới có quyền truy cập.' });
  }
  next();
}; 