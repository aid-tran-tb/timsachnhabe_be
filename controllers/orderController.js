const Order = require("../models/order");
const Product = require("../models/product_book");
const mongoose = require("mongoose");

// Lấy tất cả orders
exports.getAllOrders = async (req, res) => {
  try {
    // Log để kiểm tra
    console.log("Fetching orders...");

    // Kiểm tra trạng thái kết nối database
    if (mongoose.connection.readyState !== 1) {
      console.log(
        "Database connection is not ready. Current state:",
        mongoose.connection.readyState
      );
      return res.status(500).json({
        error: "Kết nối database không khả dụng, vui lòng thử lại sau",
        connectionState: mongoose.connection.readyState,
      });
    }

    const orders = await Order.find();
    console.log("Found orders:", orders.length);

    if (!orders || orders.length === 0) {
      return res.json([]); // Trả về mảng rỗng nếu không có orders
    }

    // Populate thông tin user cho từng order
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        try {
          // Populate thông tin user
          await order.populate("userId", "fullName email");
          // await order.populate('products.productId', 'title price');

          return {
            id: order._id,
            customerName: order.userId ? order.userId.fullName : "N/A",
            customerEmail: order.userId ? order.userId.email : "N/A",
            createdAt: order.createdAt,
            totalAmount: order.totalAmount || 0,
            status: order.status || "pending",
          };
        } catch (populateError) {
          console.error("Error populating order:", order._id, populateError);
          // Trả về thông tin cơ bản nếu không populate được
          return {
            id: order._id,
            customerName: "N/A",
            customerEmail: "N/A",
            createdAt: order.createdAt,
            totalAmount: order.totalAmount || 0,
            status: order.status || "pending",
          };
        }
      })
    );

    console.log("Formatted orders successfully");
    res.json(formattedOrders);
  } catch (err) {
    console.error("Error in getAllOrders:", err);

    // Xử lý lỗi kết nối MongoDB
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        error: "Không thể kết nối đến database, vui lòng thử lại sau",
        details: err.message,
      });
    }

    res.status(500).json({
      error: "Lỗi khi lấy dữ liệu orders",
      details: err.message,
    });
  }
};

// Lấy order theo ID
exports.getOrderById = async (req, res) => {
  console.log("Fetching order by ID:", req.params.id);
  try {
    // Kiểm tra trạng thái kết nối database
    if (mongoose.connection.readyState !== 1) {
      console.log(
        "Database connection is not ready. Current state:",
        mongoose.connection.readyState
      );
      return res.status(500).json({
        error: "Kết nối database không khả dụng, vui lòng thử lại sau",
        connectionState: mongoose.connection.readyState,
      });
    }

    // Kiểm tra xem ID có đúng định dạng MongoDB không
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid MongoDB ID format:", req.params.id);
      return res.status(400).json({ error: "ID đơn hàng không hợp lệ" });
    }

    // Thử lấy đơn hàng trước khi populate để kiểm tra
    const orderExists = await Order.findById(req.params.id);
    console.log("Order exists check:", !!orderExists);

    if (!orderExists) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    // Nếu đơn hàng tồn tại, thực hiện populate
    const order = await Order.findById(req.params.id);

    console.log("Order raw data:", JSON.stringify(order));
    console.log("Order userId:", order.userId);
    console.log("Order products:", order.products);

    // Populate thủ công để tránh lỗi khi không có reference
    let userData = null;
    if (order.userId) {
      const User = require("../models/user");
      try {
        userData = await User.findById(order.userId);
        console.log("User data found:", !!userData);
      } catch (userErr) {
        console.error("Error fetching user data:", userErr);
      }
    }

    // Populate thông tin sản phẩm
    const populatedProducts = [];
    if (order.products && order.products.length > 0) {
      for (const item of order.products) {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            populatedProducts.push({
              product,
              quantity: item.quantity,
              price: item.price || product.price,
            });
          } else {
            console.log("Product not found for ID:", item.productId);
            populatedProducts.push({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              productNotFound: true,
            });
          }
        } catch (productErr) {
          console.error("Error fetching product:", productErr);
        }
      }
    }

    console.log("Populated products count:", populatedProducts.length);

    // Tạo response object một cách an toàn
    const formattedOrder = {
      id: order._id,
      orderInfo: {
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        status: order.status,
        orderDate: order.orderDate,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
      },
    };

    // Thêm thông tin khách hàng nếu có
    if (userData) {
      formattedOrder.customerInfo = {
        id: userData._id,
        name: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber || "N/A",
        address: userData.address || "N/A",
      };
    } else {
      formattedOrder.customerInfo = {
        id: order.userId,
        name: "N/A",
        email: "N/A",
        phoneNumber: "N/A",
        address: "N/A",
      };
    }

    // Thêm thông tin sản phẩm
    formattedOrder.items = populatedProducts.map((item) => {
      if (item.productNotFound) {
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price || 0,
          subtotal: (item.price || 0) * item.quantity,
          productNotFound: true,
        };
      }

      return {
        productId: item.product._id,
        ISBN: item.product.ISBN,
        title: item.product.bookTitle,
        author: item.product.author,
        price: item.price || item.product.price,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        subtotal: (item.price || item.product.price) * item.quantity,
      };
    });

    console.log("Formatted response successfully");
    res.json(formattedOrder);
  } catch (err) {
    console.error("Error in getOrderById:", err);
    res.status(500).json({
      error: "Lỗi khi lấy dữ liệu đơn hàng",
      details: err.message,
      stack: err.stack,
    });
  }
};

// Tạo order mới
exports.createOrder = async (req, res) => {
  try {
    // Kiểm tra trạng thái kết nối database
    if (mongoose.connection.readyState !== 1) {
      console.log(
        "Database connection is not ready. Current state:",
        mongoose.connection.readyState
      );
      return res.status(500).json({
        error: "Kết nối database không khả dụng, vui lòng thử lại sau",
        connectionState: mongoose.connection.readyState,
      });
    }

    // Lấy userId từ request body
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId là bắt buộc" });
    }

    // Tạo đơn hàng với dữ liệu từ người dùng
    const orderData = {
      ...req.body,
      orderDate: new Date().toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Tính toán tổng tiền từ sản phẩm
    let totalAmount = 0;
    if (orderData.products && orderData.products.length > 0) {
      orderData.products.forEach((item) => {
        totalAmount += item.price * item.quantity;
      });
    }
    orderData.totalAmount = totalAmount;

    // Kiểm tra số lượng tồn kho trước khi tạo đơn hàng
    if (orderData.products && orderData.products.length > 0) {
      for (const item of orderData.products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            error: "Sản phẩm không tồn tại",
            productId: item.productId,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: "Số lượng sản phẩm trong kho không đủ",
            product: product.bookTitle,
            requested: item.quantity,
            available: product.stock,
          });
        }
      }
    }

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Cập nhật soldCount và giảm stock cho từng sản phẩm trong đơn hàng
    if (savedOrder.products && savedOrder.products.length > 0) {
      const updatePromises = savedOrder.products.map(async (item) => {
        // Tăng soldCount và giảm stock của sản phẩm theo số lượng mua
        return Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              soldCount: item.quantity,
              stock: -item.quantity,
            },
          },
          { new: true }
        );
      });

      // Chờ tất cả các thao tác cập nhật hoàn tất
      await Promise.all(updatePromises);
      console.log("Updated product data for all products in the order");
    }

    // Thêm order ID vào mảng orders của user
    const User = require("../models/user");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );
    console.log("Updated user:", updatedUser);
    console.log("Updated user with new order reference");

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);

    // Xử lý lỗi kết nối MongoDB
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        error: "Không thể kết nối đến database, vui lòng thử lại sau",
        details: err.message,
      });
    }

    res.status(400).json({ error: "Lỗi khi tạo order", details: err.message });
  }
};

// Cập nhật order
exports.updateOrder = async (req, res) => {
  try {
    // Kiểm tra trạng thái kết nối database
    if (mongoose.connection.readyState !== 1) {
      console.log(
        "Database connection is not ready. Current state:",
        mongoose.connection.readyState
      );
      return res.status(500).json({
        error: "Kết nối database không khả dụng, vui lòng thử lại sau",
        connectionState: mongoose.connection.readyState,
      });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy order" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error updating order:", err);

    // Xử lý lỗi kết nối MongoDB
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        error: "Không thể kết nối đến database, vui lòng thử lại sau",
        details: err.message,
      });
    }

    res
      .status(400)
      .json({ error: "Lỗi khi cập nhật order", details: err.message });
  }
};

// Xóa order
exports.deleteOrder = async (req, res) => {
  try {
    // Kiểm tra trạng thái kết nối database
    if (mongoose.connection.readyState !== 1) {
      console.log(
        "Database connection is not ready. Current state:",
        mongoose.connection.readyState
      );
      return res.status(500).json({
        error: "Kết nối database không khả dụng, vui lòng thử lại sau",
        connectionState: mongoose.connection.readyState,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy order" });
    }

    // Lấy userId từ order để cập nhật mảng orders của user
    const userId = order.userId;

    // Xóa order
    await Order.findByIdAndDelete(req.params.id);

    // Xóa reference đến order này khỏi mảng orders của user
    if (userId) {
      const User = require("../models/user");
      await User.findByIdAndUpdate(
        userId,
        { $pull: { orders: req.params.id } },
        { new: true }
      );
      console.log("Removed order reference from user");
    }

    res.json({ message: "Đã xóa order thành công" });
  } catch (err) {
    console.error("Error deleting order:", err);

    // Xử lý lỗi kết nối MongoDB
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        error: "Không thể kết nối đến database, vui lòng thử lại sau",
        details: err.message,
      });
    }

    res.status(500).json({ error: "Lỗi khi xóa order", details: err.message });
  }
};

// Lấy thống kê về đơn hàng, doanh thu và user
exports.getOrderStatistics = async (req, res) => {
  const { filter, fromDate, toDate } = req.query;
  try {
    console.log("Fetching order statistics...");

    // Kiểm tra trạng thái kết nối database
    if (mongoose.connection.readyState !== 1) {
      console.log(
        "Database connection is not ready. Current state:",
        mongoose.connection.readyState
      );
      return res.status(500).json({
        error: "Kết nối database không khả dụng, vui lòng thử lại sau",
        connectionState: mongoose.connection.readyState,
      });
    }

    // Tạo điều kiện lọc theo thời gian
    let dateFilter = {};
    const now = new Date();

    if (filter) {
      if (filter === "1") {
        // Tuần hiện tại
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);
        dateFilter = {
          orderDate: {
            $gte: startOfWeek.toISOString(),
            $lte: new Date().toISOString(),
          },
        };
      } else if (filter === "2") {
        // Tháng hiện tại
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = {
          orderDate: {
            $gte: startOfMonth.toISOString(),
            $lte: new Date().toISOString(),
          },
        };
      } else if (filter === "3") {
        // Năm hiện tại
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        dateFilter = {
          orderDate: {
            $gte: startOfYear.toISOString(),
            $lte: new Date().toISOString(),
          },
        };
      }
    }
    if (fromDate && toDate) {
      // Nếu có fromDate và toDate, ưu tiên sử dụng chúng
      dateFilter = {
        orderDate: {
          $gte: new Date(fromDate).toISOString(),
          $lte: new Date(toDate).toISOString(),
        },
      };
    }

    // Tổng số đơn hàng
    const totalOrders = await Order.countDocuments(dateFilter);
    console.log("Total orders count:", totalOrders);

    // Tổng số đơn hàng với trạng thái pending
    const pendingOrders = await Order.countDocuments({
      ...dateFilter,
      status: "pending",
    });
    console.log("Pending orders count:", pendingOrders);

    // Tổng doanh thu (tổng totalAmount của tất cả đơn hàng)
    let totalRevenue = 0;
    try {
      const revenueResult = await Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);
      totalRevenue =
        revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
      console.log("Total revenue calculated:", totalRevenue);
    } catch (revenueErr) {
      console.error("Error calculating revenue:", revenueErr);
      // Continue with zero revenue
    }

    // Tổng số người dùng (có role = 'user')
    let totalUsers = 0;
    try {
      const User = require("../models/user");
      totalUsers = await User.countDocuments({ role: "user" });
      console.log("Total users count:", totalUsers);
    } catch (userErr) {
      console.error("Error counting users:", userErr);
      // Continue with zero users
    }

    // 5 đơn hàng gần nhất
    let recentOrders = [];
    try {
      recentOrders = await Order.find(dateFilter)
        .sort({ createdAt: -1 })
        .limit(5);
      console.log("Recent orders fetched:", recentOrders.length);
    } catch (recentErr) {
      console.error("Error fetching recent orders:", recentErr);
      // Continue with empty orders
    }

    // Format đơn hàng gần đây để có thông tin chi tiết hơn
    const formattedRecentOrders = await Promise.all(
      recentOrders.map(async (order) => {
        try {
          // Lấy thông tin người dùng nếu có userId
          let customerName = "N/A";
          let customerEmail = "N/A";

          if (order.userId) {
            try {
              const User = require("../models/user");
              const user = await User.findById(order.userId);
              if (user) {
                customerName = user.fullName || "N/A";
                customerEmail = user.email || "N/A";
              }
            } catch (userErr) {
              console.error(
                `Error fetching user for order ${order._id}:`,
                userErr
              );
            }
          }

          return {
            id: order._id,
            totalAmount: order.totalAmount || 0,
            status: order.status || "pending",
            orderDate: order.orderDate || order.createdAt,
            customerName,
            customerEmail,
            productCount: order.products ? order.products.length : 0,
          };
        } catch (orderErr) {
          console.error(`Error formatting order ${order._id}:`, orderErr);
          return {
            id: order._id,
            totalAmount: 0,
            status: "unknown",
            orderDate: order.createdAt,
            customerName: "Error",
            customerEmail: "Error",
            productCount: 0,
          };
        }
      })
    );

    console.log("Formatted recent orders successfully");

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalUsers,
      recentOrders: formattedRecentOrders,
    });
  } catch (err) {
    console.error("Error getting order statistics:", err);

    // Xử lý lỗi kết nối MongoDB
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        error: "Không thể kết nối đến database, vui lòng thử lại sau",
        details: err.message,
      });
    }

    res.status(500).json({
      error: "Lỗi khi lấy thống kê đơn hàng",
      details: err.message,
      stack: err.stack,
    });
  }
};
