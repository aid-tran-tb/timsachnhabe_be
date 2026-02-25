const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Đăng ký user mới
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, address, role } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber: phoneNumber || '',
            address: address || '',
            role: role || 'user'
        });

        await user.save();

        res.status(201).json({ message: 'Đăng ký thành công', user: {
            id: user._id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            address: user.address,
            role: user.role
        }});
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        res.status(500).json({ error: 'Lỗi khi đăng ký' });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Kiểm tra email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email không tồn tại' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mật khẩu không đúng' });
        }

        // Trả về thông tin user (không bao gồm password)
        res.json({
            user: {
                id: user._id,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        res.status(500).json({ error: 'Lỗi khi đăng nhập' });
    }
};

// Đăng xuất
exports.logout = (req, res) => {
    try {
        res.json({ message: 'Đăng xuất thành công' });
    } catch (err) {
        console.error('Lỗi đăng xuất:', err);
        res.status(500).json({ error: 'Lỗi khi đăng xuất' });
    }
}; 

//forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Kiểm tra email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email không tồn tại' });
        }
        //trả response 
        res.status(200).json({ message: 'Xác thực thành công' });
    } catch (err) {
        console.error('Lỗi forgot password:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

//reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        // Kiểm tra email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email không tồn tại' });
        }   
        //mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        //cập nhật mật khẩu mới
        user.password = hashedPassword;
        await user.save();
        //trả response 
        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });

    } catch (err) {
        console.error('Lỗi reset password:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};
