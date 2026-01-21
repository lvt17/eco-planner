# Eco-Planner

Nền tảng thương mại điện tử thông minh tích hợp trí tuệ nhân tạo, hỗ trợ chat thời gian thực và thanh toán trực tuyến.

---

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Tính năng chính](#tính-năng-chính)
3. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
4. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
5. [Cài đặt và triển khai](#cài-đặt-và-triển-khai)
6. [Cấu trúc dự án](#cấu-trúc-dự-án)
7. [Hướng dẫn sử dụng API](#hướng-dẫn-sử-dụng-api)
8. [Tính năng Socket.io](#tính-năng-socketio)
9. [Cấu hình môi trường](#cấu-hình-môi-trường)
10. [Kiểm thử](#kiểm-thử)
11. [Giấy phép](#giấy-phép)

---

## Giới thiệu

Eco-Planner là một nền tảng thương mại điện tử toàn diện được xây dựng với mục tiêu cung cấp trải nghiệm mua sắm trực tuyến thông minh và hiện đại. Hệ thống tích hợp trí tuệ nhân tạo để hỗ trợ khách hàng, cung cấp giao tiếp thời gian thực giữa người dùng và quản trị viên, đồng thời hỗ trợ nhiều hình thức thanh toán phổ biến tại Việt Nam.

---

## Tính năng chính

### Dành cho khách hàng

- Đăng ký và đăng nhập tài khoản với xác thực JWT
- Duyệt và tìm kiếm sản phẩm theo danh mục
- Xem chi tiết sản phẩm với mô tả được tạo bởi AI
- Quản lý giỏ hàng
- Đặt hàng và theo dõi trạng thái đơn hàng
- Thanh toán trực tuyến qua MoMo, VNPay hoặc thanh toán khi nhận hàng (COD)
- Chat trực tiếp với hỗ trợ viên hoặc chatbot AI
- Quản lý thông tin cá nhân

### Dành cho quản trị viên

- Bảng điều khiển tổng quan với thống kê thời gian thực
- Quản lý sản phẩm (thêm, sửa, xóa)
- Quản lý đơn hàng và cập nhật trạng thái
- Quản lý khách hàng (xem thông tin, khóa tài khoản)
- Hệ thống chat hỗ trợ khách hàng với phân tích cảm xúc
- Theo dõi số lượng khách truy cập trực tuyến

### Tính năng AI

- Tạo mô tả sản phẩm tự động sử dụng mô hình ngôn ngữ lớn
- Chatbot hỗ trợ khách hàng với khả năng hiểu ngữ cảnh
- Phân tích cảm xúc tin nhắn để ưu tiên hỗ trợ
- Cơ chế Circuit Breaker với mô hình dự phòng đảm bảo tính sẵn sàng cao

---

## Kiến trúc hệ thống

Dự án được xây dựng theo kiến trúc Monorepo với hai thành phần chính:

```
eco-planner/
  ecoplanner-be/    Backend API (Node.js - Express - Socket.io)
  ecoplanner-fe/    Frontend (React - Vite - TypeScript)
```

### Sơ đồ kiến trúc

```
                    +-----------------+
                    |   React Client  |
                    |     (Vite)      |
                    +--------+--------+
                             |
              HTTP REST API  |  WebSocket (Socket.io)
                             |
                    +--------v--------+
                    |  Express Server |
                    |   + Socket.io   |
                    +--------+--------+
                             |
         +-------------------+-------------------+
         |                   |                   |
+--------v--------+ +--------v--------+ +--------v--------+
|   PostgreSQL    | |  HuggingFace AI | | Payment Gateway |
|   (Prisma ORM)  | |     (API)       | | (MoMo / VNPay)  |
+-----------------+ +-----------------+ +-----------------+
```

---

## Công nghệ sử dụng

### Backend (ecoplanner-be)

| Thành phần     | Công nghệ                          |
| ---------------- | ------------------------------------ |
| Ngôn ngữ       | TypeScript                           |
| Framework        | Express.js                           |
| Database         | PostgreSQL                           |
| ORM              | Prisma                               |
| Xác thực       | JWT (jsonwebtoken)                   |
| Thời gian thực | Socket.io                            |
| AI Service       | HuggingFace Inference API            |
| Thanh toán      | VNPay, MoMo                          |
| Bảo mật        | Helmet, bcryptjs, express-rate-limit |
| Validation       | Zod                                  |
| Testing          | Jest, Supertest, Nock                |

### Frontend (ecoplanner-fe)

| Thành phần     | Công nghệ         |
| ---------------- | ------------------- |
| Ngôn ngữ       | TypeScript          |
| Framework        | React 19            |
| Build Tool       | Vite                |
| Routing          | React Router DOM v7 |
| Icon             | Lucide React        |
| Thời gian thực | Socket.io Client    |

---

## Cài đặt và triển khai

### Yêu cầu hệ thống

- Node.js phiên bản 18.0 trở lên
- PostgreSQL phiên bản 14.0 trở lên hoặc Docker
- npm hoặc yarn

### Bước 1: Clone dự án

```bash
git clone <repository-url>
cd eco-planner
```

### Bước 2: Cài đặt Backend

```bash
cd ecoplanner-be
npm install
```

#### Khởi động PostgreSQL với Docker (tùy chọn)

```bash
docker-compose up -d
```

#### Cấu hình biến môi trường

Tạo file `.env` trong thư mục `ecoplanner-be` với nội dung:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecoplanner?schema=public"
JWT_SECRET="your-secret-key"
HUGGINGFACE_API_KEY="your-huggingface-api-key"
FRONTEND_URL="http://localhost:5173"
PORT=3001

# Cấu hình thanh toán
VNPAY_TMN_CODE="your-vnpay-tmn-code"
VNPAY_SECURE_SECRET="your-vnpay-secret"
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="http://localhost:5173/payment/return"
```

#### Khởi tạo database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

#### Chạy Backend

```bash
# Chế độ phát triển
npm run dev

# Chế độ production
npm run build
npm run start
```

### Bước 3: Cài đặt Frontend

```bash
cd ecoplanner-fe
npm install
```

#### Cấu hình biến môi trường

Tạo file `.env.local` trong thư mục `ecoplanner-fe`:

```env
VITE_API_URL=http://localhost:3001
```

#### Chạy Frontend

```bash
# Chế độ phát triển
npm run dev

# Build production
npm run build
npm run preview
```

---

## Cấu trúc dự án

### Backend (ecoplanner-be)

```
ecoplanner-be/
  prisma/
    schema.prisma         Định nghĩa các model database
    seed.ts               Dữ liệu mẫu cho môi trường phát triển
  src/
    index.ts              Điểm khởi đầu ứng dụng
    config/
      index.ts            Cấu hình môi trường
    controllers/
      auth.ts             Xử lý đăng ký, đăng nhập, thông tin người dùng
      products.ts         CRUD sản phẩm và tạo mô tả AI
      chat.ts             Quản lý tin nhắn và hội thoại
      orders.ts           Quản lý đơn hàng
      payment.ts          Xử lý thanh toán VNPay và MoMo
      admin.ts            API dành cho quản trị viên
    middleware/
      auth.ts             Middleware xác thực JWT
      errorHandler.ts     Xử lý lỗi toàn cục
    services/
      AIService.ts        Tích hợp HuggingFace với cơ chế dự phòng
      ChatService.ts      Quản lý hội thoại và phân tích cảm xúc
    socket/
      handlers.ts         Xử lý sự kiện Socket.io
    prisma/
      client.ts           Singleton Prisma Client
  tests/
    unit/                 Kiểm thử đơn vị
    integration/          Kiểm thử tích hợp
    e2e/                  Kiểm thử end-to-end
  docker-compose.yml      Cấu hình Docker cho PostgreSQL
  jest.config.js          Cấu hình Jest
  tsconfig.json           Cấu hình TypeScript
```

### Frontend (ecoplanner-fe)

```
ecoplanner-fe/
  index.html              Template HTML chính
  App.tsx                 Component gốc với cấu hình routing
  index.tsx               Điểm khởi đầu ứng dụng
  components/             Các component tái sử dụng
  contexts/               React Context cho state management
  hooks/                  Custom hooks
  pages/
    Home.tsx              Trang chủ
    Shop.tsx              Trang cửa hàng
    ProductDetail.tsx     Chi tiết sản phẩm
    Cart.tsx              Giỏ hàng
    Checkout.tsx          Thanh toán
    OrderSuccess.tsx      Xác nhận đơn hàng thành công
    PaymentReturn.tsx     Xử lý callback thanh toán
    Login.tsx             Đăng nhập
    Register.tsx          Đăng ký
    Profile.tsx           Thông tin cá nhân
    About.tsx             Giới thiệu
    Blog.tsx              Tin tức
    admin/
      Dashboard.tsx       Bảng điều khiển quản trị
      Products.tsx        Quản lý sản phẩm
      Orders.tsx          Quản lý đơn hàng
      Customers.tsx       Quản lý khách hàng
      Chat.tsx            Hỗ trợ khách hàng
  services/               Các service gọi API
  vite.config.ts          Cấu hình Vite
  tsconfig.json           Cấu hình TypeScript
```

---

## Hướng dẫn sử dụng API

### Xác thực (Authentication)

| Phương thức | Endpoint           | Mô tả                                  |
| -------------- | ------------------ | ---------------------------------------- |
| POST           | /api/auth/register | Đăng ký tài khoản mới              |
| POST           | /api/auth/login    | Đăng nhập                             |
| GET            | /api/auth/me       | Lấy thông tin người dùng hiện tại |

### Sản phẩm (Products)

| Phương thức | Endpoint            | Mô tả                       |
| -------------- | ------------------- | ----------------------------- |
| GET            | /api/products       | Lấy danh sách sản phẩm    |
| GET            | /api/products/:slug | Lấy chi tiết sản phẩm     |
| POST           | /api/products       | Tạo sản phẩm mới (Admin)  |
| PUT            | /api/products/:id   | Cập nhật sản phẩm (Admin) |
| DELETE         | /api/products/:id   | Xóa sản phẩm (Admin)       |

### Đơn hàng (Orders)

| Phương thức | Endpoint               | Mô tả                                     |
| -------------- | ---------------------- | ------------------------------------------- |
| GET            | /api/orders            | Lấy danh sách đơn hàng                 |
| GET            | /api/orders/:id        | Lấy chi tiết đơn hàng                  |
| POST           | /api/orders            | Tạo đơn hàng mới                       |
| PUT            | /api/orders/:id/status | Cập nhật trạng thái đơn hàng (Admin) |

### Thanh toán (Payment)

| Phương thức | Endpoint                   | Mô tả                          |
| -------------- | -------------------------- | -------------------------------- |
| POST           | /api/payment/vnpay/create  | Tạo URL thanh toán VNPay       |
| GET            | /api/payment/vnpay/return  | Callback xử lý kết quả VNPay |
| POST           | /api/payment/momo/create   | Tạo yêu cầu thanh toán MoMo  |
| POST           | /api/payment/momo/callback | Callback xử lý kết quả MoMo  |

### Chat

| Phương thức | Endpoint                | Mô tả                     |
| -------------- | ----------------------- | --------------------------- |
| GET            | /api/chat/conversations | Lấy danh sách hội thoại |
| POST           | /api/chat/messages      | Gửi tin nhắn mới         |

### Quản trị (Admin)

| Phương thức | Endpoint                      | Mô tả                      |
| -------------- | ----------------------------- | ---------------------------- |
| GET            | /api/admin/dashboard          | Lấy thống kê tổng quan   |
| GET            | /api/admin/customers          | Lấy danh sách khách hàng |
| PUT            | /api/admin/customers/:id/lock | Khóa/Mở khóa tài khoản  |

---

## Tính năng Socket.io

### Các phòng (Rooms)

| Phòng        | Mô tả                                                    |
| ------------- | ---------------------------------------------------------- |
| admin-room    | Phòng dành cho quản trị viên và nhân viên hỗ trợ |
| user:{userId} | Phòng riêng cho từng người dùng                      |

### Các sự kiện (Events)

| Sự kiện        | Hướng              | Mô tả                                                      |
| ---------------- | -------------------- | ------------------------------------------------------------ |
| visitor_count    | Server -> Admin      | Cập nhật số lượng khách truy cập                      |
| update_dashboard | Server -> Admin      | Thông báo cập nhật dữ liệu dashboard                   |
| handover_request | Server -> Admin      | Yêu cầu hỗ trợ từ khách hàng có cảm xúc tiêu cực |
| ai_response      | Server -> User       | Phản hồi từ chatbot AI                                    |
| new_message      | Server -> User/Admin | Tin nhắn mới trong hội thoại                             |

---

## Cấu hình môi trường

### Biến môi trường Backend

| Biến               | Mô tả                      | Bắt buộc             |
| ------------------- | ---------------------------- | ---------------------- |
| DATABASE_URL        | URL kết nối PostgreSQL     | Co                     |
| JWT_SECRET          | Khóa bí mật cho JWT       | Co                     |
| HUGGINGFACE_API_KEY | API key của HuggingFace     | Co                     |
| FRONTEND_URL        | URL của ứng dụng frontend | Co                     |
| PORT                | Cổng chạy server           | Khong (mac dinh: 3001) |
| VNPAY_TMN_CODE      | Mã terminal VNPay           | Khong                  |
| VNPAY_SECURE_SECRET | Khóa bảo mật VNPay        | Khong                  |
| VNPAY_URL           | URL API VNPay                | Khong                  |
| VNPAY_RETURN_URL    | URL callback VNPay           | Khong                  |

### Biến môi trường Frontend

| Biến        | Mô tả              | Bắt buộc |
| ------------ | -------------------- | ---------- |
| VITE_API_URL | URL của Backend API | Co         |

---

## Kiểm thử

Dự án được trang bị bộ kiểm thử toàn diện bao gồm:

### Kiểm thử đơn vị (Unit Tests)

Kiểm tra các service riêng lẻ, đặc biệt là cơ chế dự phòng của AI Service.

```bash
npm run test
```

### Kiểm thử tích hợp (Integration Tests)

Kiểm tra các endpoint API REST với database thực.

```bash
npm run test -- --testPathPattern=integration
```

### Kiểm thử End-to-End (E2E Tests)

Kiểm tra luồng Socket.io và các tương tác thời gian thực.

```bash
npm run test -- --testPathPattern=e2e
```

### Báo cáo độ phủ (Coverage Report)

```bash
npm run test
```

Báo cáo sẽ được tạo trong thư mục `coverage/`.

---

## Giấy phép

Dự án này được phát triển bởi Liêu Vĩnh Toàn. Mọi quyền được bảo lưu.

---

## Liên hệ

Nếu có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ với tác giả:

**Liêu Vĩnh Toàn**
