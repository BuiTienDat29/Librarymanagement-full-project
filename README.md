# 📚 Library Management System

> Hệ thống Quản lý Thư viện được phát triển trong khuôn khổ Đồ án Tốt nghiệp nhằm số hóa quy trình quản lý sách, người dùng và hoạt động mượn trả sách trong thư viện.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Maven](https://img.shields.io/badge/Maven-Build-red)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 🚀 Giới thiệu

Library Management System là một hệ thống quản lý thư viện được xây dựng theo mô hình Fullstack với mục tiêu:

* Quản lý sách trong thư viện
* Quản lý người dùng
* Quản lý hoạt động mượn/trả sách
* Theo dõi lịch sử giao dịch
* Hỗ trợ phân quyền người dùng
* Thống kê dữ liệu thư viện

Dự án được thiết kế theo kiến trúc nhiều lớp (Layered Architecture) giúp dễ dàng mở rộng và bảo trì.

---

# 🛠️ Công nghệ sử dụng

## Backend

* Java 17
* Spring Boot
* Spring MVC
* Spring Security
* Spring Data JPA
* Hibernate
* Maven

## Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap

## Database

* MySQL 8

## Công cụ

* Git
* GitHub
* IntelliJ IDEA
* VS Code
* Postman

---

# 🏗️ Kiến trúc dự án

```text
library-full-project
│
├── library-project
│   ├── src/main/java
│   ├── src/main/resources
│   └── pom.xml
│
├── library-frontend
│   ├── html
│   ├── css
│   └── js
│
├── docs
│
└── README.md
```

---

# ✨ Chức năng chính

## 👨‍💼 Quản trị viên (Admin)

* Đăng nhập hệ thống
* Quản lý người dùng
* Quản lý sách
* Thêm/Sửa/Xóa sách
* Quản lý danh mục sách
* Theo dõi lịch sử mượn trả
* Xem thống kê hệ thống

## 🎓 Sinh viên (Student)

* Đăng nhập hệ thống
* Tìm kiếm sách
* Xem thông tin sách
* Mượn sách
* Trả sách
* Xem lịch sử mượn sách
* Cập nhật thông tin cá nhân

---

# 📋 Yêu cầu hệ thống

| Thành phần | Phiên bản |
| ---------- | --------- |
| Java       | 17+       |
| MySQL      | 8.0+      |
| Maven      | 3.8+      |
| Git        | Mới nhất  |

---

# ⚙️ Cài đặt dự án

## 1. Clone Repository

```bash
git clone https://github.com/BuiTienDat29/Librarymanagement-full-project.git

cd Librarymanagement-full-project
```

---

## 2. Tạo Database

```sql
CREATE DATABASE library_db;
```

---

## 3. Cấu hình Database

Mở file:

```text
src/main/resources/application.properties
```

hoặc

```text
src/main/resources/application.yml
```

Cấu hình:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 4. Chạy Backend

Linux / MacOS

```bash
./mvnw spring-boot:run
```

Windows

```bash
mvnw.cmd spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080
```

---

## 5. Truy cập hệ thống

```text
http://localhost:8080
```

---

# 🔐 Tài khoản mặc định

## Quản trị viên

```text
Username: admin
Password: Admin@123
```

## Sinh viên

```text
Username: student001
Password: Student@123
```

> ⚠️ Nên thay đổi mật khẩu mặc định sau lần đăng nhập đầu tiên.

---

# 📚 API Endpoints chính

| Method | Endpoint                | Mô tả          |
| ------ | ----------------------- | -------------- |
| POST   | /api/auth/login         | Đăng nhập      |
| POST   | /api/auth/register      | Đăng ký        |
| GET    | /api/books              | Danh sách sách |
| GET    | /api/books/{id}         | Chi tiết sách  |
| POST   | /api/books              | Thêm sách      |
| PUT    | /api/books/{id}         | Cập nhật sách  |
| DELETE | /api/books/{id}         | Xóa sách       |
| POST   | /api/borrow             | Mượn sách      |
| PUT    | /api/borrow/{id}/return | Trả sách       |
| GET    | /api/reports/summary    | Thống kê       |

---

# 🧪 Test API bằng Postman

## Đăng nhập

```http
POST http://localhost:8080/api/auth/login
```

Request Body

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

---

# 🗄️ Thiết kế cơ sở dữ liệu

Các thực thể chính:

* User
* Role
* Book
* Category
* BorrowRecord

Mối quan hệ:

```text
User
 │
 ├── Role
 │
 └── BorrowRecord

Book
 │
 └── BorrowRecord

Category
 │
 └── Book
```

---

# 📸 Hình ảnh hệ thống

## Trang đăng nhập

> Thêm ảnh login tại đây

## Dashboard Admin

> Thêm ảnh dashboard tại đây

## Quản lý sách

> Thêm ảnh quản lý sách tại đây

## Mượn / Trả sách

> Thêm ảnh chức năng mượn trả sách tại đây

---

# 🎯 Kiến thức áp dụng

Trong dự án này đã áp dụng:

* OOP (Object-Oriented Programming)
* MVC Architecture
* RESTful API
* Spring Security
* Authentication & Authorization
* JPA & Hibernate
* MySQL Database Design
* Git & GitHub Workflow
* Fullstack Development

---

# 🚀 Hướng phát triển

* JWT Authentication
* Email Notification
* Redis Cache
* Docker Deployment
* CI/CD Pipeline
* Elasticsearch
* Microservices Architecture

---

# 👨‍💻 Tác giả

**Bùi Tiến Đạt**

* GitHub: https://github.com/BuiTienDat29
* Project: Library Management System

---

# ⭐ Đánh giá

Nếu bạn thấy dự án hữu ích, hãy để lại một **Star ⭐** trên GitHub.

Điều đó sẽ là nguồn động lực lớn để tiếp tục phát triển và cải thiện dự án.
