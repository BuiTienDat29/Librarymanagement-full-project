# 📚 Hệ thống Quản lý Thư viện — ĐHCNĐA

## Yêu cầu
- Java 17+
- PostgreSQL 14+
- Node.js 18+ (cho frontend)
- Maven 3.8+

## Cấu hình

### 1. Tạo database
```sql
CREATE DATABASE library_db;
```

### 2. Cấu hình `src/main/resources/application.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/library_db
    username: postgresql   # username PostgreSQL của bạn
    password: 123456       # password của bạn
```

## Chạy Backend
```bash
./mvnw spring-boot:run
# Windows:
mvnw.cmd spring-boot:run
```
Server chạy tại: http://localhost:8080

Khi khởi động lần đầu, hệ thống tự tạo:
- 3 roles: ADMIN, LIBRARIAN, STUDENT
- Tài khoản admin: `admin` / `Admin@123`

## Chạy Frontend
```bash
cd library-frontend
npm install
npm start
```
App chạy tại: http://localhost:3000

## Test API (Postman)
```
POST http://localhost:8080/api/auth/login
{
  "username": "admin",
  "password": "Admin@123"
}
```

## Tài khoản mặc định
| Username | Password   | Role     |
|----------|------------|----------|
| admin    | Admin@123  | ADMIN    |

> ⚠️ Đổi mật khẩu admin ngay sau khi đăng nhập lần đầu!

## API Endpoints chính
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/login | Đăng nhập |
| POST | /api/auth/register | Đăng ký |
| GET | /api/books | Danh sách sách (public) |
| POST | /api/borrow | Mượn sách |
| PUT | /api/borrow/{id}/return | Trả sách |
| GET | /api/reports/summary | Thống kê tổng quan |
