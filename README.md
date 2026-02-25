# Book E-commerce API

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd Book-E-commerce
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và cấu hình các biến môi trường:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-ecommerce
JWT_SECRET=your_jwt_secret_key_here
```

4. Chạy server:
```bash
npm start
```

## API Documentation

### Authentication APIs

#### Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
    "fullName": "Nguyen Van A",
    "email": "a@gmail.com",
    "password": "123456"
}
```

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "a@gmail.com",
    "password": "123456"
}
```

#### Đăng xuất
```http
POST /api/auth/logout
Authorization: Bearer your_jwt_token
```

### Admin APIs

#### Lấy danh sách admin
```http
GET /api/admins
Authorization: Bearer your_jwt_token
```

#### Lấy thông tin admin theo ID
```http
GET /api/admins/:id
Authorization: Bearer your_jwt_token
```

#### Tạo admin mới
```http
POST /api/admins
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "username": "newadmin",
    "password": "password123",
    "role": "admin"
}
```

#### Cập nhật admin
```http
PUT /api/admins/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "username": "updatedadmin",
    "role": "superadmin"
}
```

#### Xóa admin
```http
DELETE /api/admins/:id
Authorization: Bearer your_jwt_token
```

### Catalog APIs

#### Lấy danh sách sách
```http
GET /api/catalog
```

#### Lấy thông tin sách theo ID
```http
GET /api/catalog/:id
```

#### Tạo sách mới
```http
POST /api/catalog
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "title": "Book Title",
    "author": "Author Name",
    "price": 29.99,
    "description": "Book description",
    "category": "Fiction"
}
```

#### Cập nhật sách
```http
PUT /api/catalog/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "title": "Updated Title",
    "price": 39.99
}
```

#### Xóa sách
```http
DELETE /api/catalog/:id
Authorization: Bearer your_jwt_token
```

### Order APIs

#### Lấy danh sách đơn hàng
```http
GET /api/orders
Authorization: Bearer your_jwt_token
```

#### Lấy thông tin đơn hàng theo ID
```http
GET /api/orders/:id
Authorization: Bearer your_jwt_token
```

#### Tạo đơn hàng mới
```http
POST /api/orders
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "items": [
        {
            "bookId": "book_id_here",
            "quantity": 2
        }
    ],
    "shippingAddress": "123 Street Name, City, Country"
}
```

#### Cập nhật trạng thái đơn hàng
```http
PUT /api/orders/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "status": "shipped"
}
```

### Review APIs

#### Lấy danh sách đánh giá
```http
GET /api/reviews
```

#### Lấy đánh giá theo ID
```http
GET /api/reviews/:id
```

#### Tạo đánh giá mới
```http
POST /api/reviews
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "bookId": "book_id_here",
    "rating": 5,
    "comment": "Great book!"
}
```

#### Cập nhật đánh giá
```http
PUT /api/reviews/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "rating": 4,
    "comment": "Updated review"
}
```

#### Xóa đánh giá
```http
DELETE /api/reviews/:id
Authorization: Bearer your_jwt_token
```

## Authentication

Hầu hết các API endpoints yêu cầu xác thực thông qua JWT token. Để sử dụng các API được bảo vệ:

1. Đăng nhập để lấy JWT token
2. Thêm token vào header của request:
```
Authorization: Bearer your_jwt_token
```

## Error Handling

API trả về các mã lỗi HTTP phổ biến:
- 200: Thành công
- 201: Tạo mới thành công
- 400: Lỗi dữ liệu đầu vào
- 401: Chưa xác thực
- 403: Không có quyền truy cập
- 404: Không tìm thấy
- 500: Lỗi server

## Swagger Documentation

API documentation đầy đủ có thể truy cập tại:
```
http://localhost:3000/api-docs
```

## API User (Chỉ dành cho admin)

### Lấy danh sách user
```http
GET /api/users
Authorization: Bearer <admin_jwt_token>
```
**Response:**
```
[
  {
    "id": "...",
    "fullName": "Nguyen Van A",
    "status": "active",
    "totalOrders": 3,
    "totalSpent": 500000
  },
  ...
]
```

### Lấy thông tin user theo id
```http
GET /api/users/{id}
Authorization: Bearer <admin_jwt_token>
```

### Cập nhật user
```http
PUT /api/users/{id}
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "status": "inactive"
}
```

### Xóa user
```http
DELETE /api/users/{id}
Authorization: Bearer <admin_jwt_token>
```

> **Lưu ý:** Chỉ tài khoản có role `admin` mới gọi được các API này. 