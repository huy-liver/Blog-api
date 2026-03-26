# RESTful Blog API 

Dự án xây dựng RESTful Blog API sử dụng Node.js, Express, và lưu trữ dữ liệu hoàn toàn bằng file JSON thay vì MongoDB theo yêu cầu của đề tài.

**Thời hạn nộp:** 28 tháng 3

## Công nghệ & Thư viện
- **Node.js**: Nền tảng chạy ứng dụng.
- **Express.js**: Web framework.
- **JSON Files**: Lưu trữ dữ liệu (Database file ở `src/data`).
- **Bcrypt**: Hash mật khẩu.
- **JSONWebToken (JWT)**: Authentication & Authorization.
- **Multer**: Xử lý upload ảnh.
- **Joi**: Validate dữ liệu request.

## Cấu trúc thư mục (3 Lớp)
- `routes/`: Định tuyến các endpoint.
- `controllers/`: Parsing request/response.
- `services/`: Nghiệp vụ lõi (vd: Phân trang, Search, Xử lý hash, v.v.).
- `repositories/`: Quản lý đọc/ghi các file `users.json`, `posts.json`.

## Hướng dẫn cài đặt và chạy server

1. Tải project về máy và cd vào thư mục root.
2. Chạy lệnh cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Chạy Server ở chế độ dev (nodemon):
   ```bash
   npm run dev
   ```
4. Server sẽ chạy trên địa chỉ: `http://localhost:5000` (Postman Collection hoặc tự test ở địa chỉ này).

## API Endpoints (`Base URL: http://localhost:5000/api`)

### Authentication (`/auth`)
- `POST /register`: Đăng ký tài khoản (body raw json: `username`, `email`, `password`).
- `POST /login`: Đăng nhập, nhận token (body raw json: `email`, `password`).

### Posts (`/posts`)
- `GET /`: Lấy toàn bộ bài viết, Query hỗ trợ: `?page=1&limit=10`.
- `GET /search`: Tìm kiếm, bộ lọc Query hỗ trợ: `?q=Node&tag=Express`.
- `GET /my-posts`: Lấy bài của mình (Yêu cầu JWT Auth Bearer Token).
- `GET /:id`: Lấy bài cụ thể.
- `POST /`: Tạo mới. Yêu cầu JWT Token. Body truyền `multipart/form-data` gồm: `title`, `content`, `tags`, và file `image`.
- `PUT /:id`: Cập nhật bài bởi tác giả hoặc admin. (Yêu cầu JWT Token).
- `DELETE /:id`: Xóa bài bởi tác giả hoặc admin (Yêu cầu JWT Token).

## Vấn đề đã giải quyết / Lựa chọn kỹ thuật
Do việc không sử dụng MongoDB nên việc truy vấn, tìm kiếm (phân trang, like search trong mảng object) được xử lý trực tiếp trên RAM bằng `Array.prototype.filter()`, `map()`. Việc đọc/ghi file `JSON` liên tục sẽ được bọc qua thư viện `fs/promises` của Node.js cùng với Node UUID.
Mặc dù không tối ưu về IO hoặc Concurrency khi lượng payload lớn, nhưng cách thiết kế này hoàn toàn đáp ứng được specs và structure của Assignment trên file System.
