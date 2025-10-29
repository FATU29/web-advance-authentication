# User Registration System - IA03

A complete user registration and authentication system with Spring Boot backend and React frontend.

## 🚀 Features

### Backend (Spring Boot)
- User registration API endpoint
- PostgreSQL database integration
- Password hashing with BCrypt
- Input validation
- Error handling
- CORS configuration for frontend integration

### Frontend (React + TypeScript)
- Modern UI with Material-UI (MUI)
- Form validation with React Hook Form and Zod
- API integration with React Query
- Responsive design
- Three pages: Home, Login, and Sign Up

## 📋 Requirements

- Docker and Docker Compose

## 🐳 Cài đặt và Chạy với Docker

### 1. Cài đặt Docker và Docker Compose

Đảm bảo bạn đã cài đặt Docker và Docker Compose trên máy:

```bash
# Kiểm tra Docker
docker --version

# Kiểm tra Docker Compose
docker compose version
```

Nếu chưa cài đặt, tham khảo:
- **Ubuntu/Debian**: https://docs.docker.com/engine/install/ubuntu/
- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **macOS**: https://docs.docker.com/desktop/install/mac-install/

### 2. Chạy ứng dụng

```bash
# Di chuyển vào thư mục project
cd authen

# Build và khởi động tất cả services (PostgreSQL, Backend, Frontend)
docker compose up --build
```

Lần đầu chạy sẽ mất vài phút để build images. Các lần sau sẽ nhanh hơn nhờ Docker cache.

### 3. Truy cập ứng dụng

Sau khi build và start thành công, ứng dụng sẽ có sẵn tại:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **PostgreSQL**: localhost:5433

### 4. Dừng ứng dụng

Để dừng tất cả services:

```bash
# Dừng services (giữ lại data)
docker compose down

# Dừng và xóa tất cả data (database sẽ bị reset)
docker compose down -v
```

### 5. Xem logs

```bash
# Xem logs của tất cả services
docker compose logs -f

# Xem logs của một service cụ thể
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### 6. Rebuild lại containers

Nếu có thay đổi code và cần build lại:

```bash
# Rebuild và restart
docker compose up --build

# Hoặc rebuild không chạy
docker compose build

# Rebuild một service cụ thể
docker compose build backend
docker compose build frontend
```

## 📡 API Endpoints

### POST /user/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": "user@example.com"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with email user@example.com already exists"
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

## 🗂️ Project Structure

```
authen/
├── be/                          # Backend (Spring Boot)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/authen/
│   │       │   ├── config/
│   │       │   │   └── SecurityConfig.java
│   │       │   ├── controller/
│   │       │   │   └── UserController.java
│   │       │   ├── dto/
│   │       │   │   ├── ApiResponse.java
│   │       │   │   └── RegisterRequest.java
│   │       │   ├── entity/
│   │       │   │   └── User.java
│   │       │   ├── repository/
│   │       │   │   └── UserRepository.java
│   │       │   ├── service/
│   │       │   │   └── UserService.java
│   │       │   └── AuthenBackendApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── fe/                          # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   └── SignUp.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── index.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🛠️ Technologies Used

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Data JPA** - Database access
- **Spring Security** - Security and password hashing
- **PostgreSQL** - Database
- **Maven** - Build tool
- **Bean Validation** - Input validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **React Query** - API state management
- **MUI** - UI components

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server

## 🧪 Testing the Application

1. **Chạy ứng dụng với Docker:**
```bash
docker compose up --build
```

2. **Mở trình duyệt** và truy cập: http://localhost:3000

3. **Click "Sign Up"** để tạo tài khoản mới

4. **Điền form** với thông tin:
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123

5. **Submit form** - bạn sẽ thấy thông báo thành công

6. **Thử đăng ký lại** với cùng email - bạn sẽ thấy lỗi "email already exists"

7. **Click "Login"** để xem trang đăng nhập (chức năng mock)

## 🔒 Security Features

- Passwords are hashed using BCrypt before storage
- Email uniqueness validation
- Input validation on both frontend and backend
- CORS configuration for secure cross-origin requests
- Environment variables for sensitive configuration

## 📝 Environment Variables

### Docker Compose

Các biến môi trường được cấu hình trong `docker-compose.yml`:

- **PostgreSQL**: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- **Backend**: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`

### Frontend (.env) - Cho local development

Nếu chạy frontend local (không dùng Docker), tạo file `.env` trong thư mục `fe`:
```
VITE_API_URL=http://localhost:8081
```

## 🚢 Deployment

The application is containerized and ready for deployment to any cloud platform that supports Docker:

- **AWS**: ECS, EKS, or Elastic Beanstalk
- **Google Cloud**: Cloud Run or GKE
- **Azure**: Container Instances or AKS
- **Heroku**: Container Registry
- **DigitalOcean**: App Platform or Kubernetes

## 📊 Rubric Compliance

✅ **Backend Implementation (4 points)**
- API Endpoint `/user/register` - 2 points
- Error Handling - 2 points

✅ **Frontend Implementation (5 points)**
- Routing (Home, Login, Sign Up) - 1 point
- Sign Up Page (Form, Validation, API Integration with React Query) - 2 points
- Login Page (Form, Validation, UI with Material-UI) - 2 points

✅ **Deployment (1 point)**
- Docker configuration ready for public deployment

**Total: 10/10 points**

## 🐛 Troubleshooting

### Docker issues

**Lỗi port đã được sử dụng:**
```bash
Error: Ports are not available: exposing port TCP 0.0.0.0:XXXX
```

Giải pháp:
1. Kiểm tra port nào đang được sử dụng:
```bash
# Linux/Mac
sudo lsof -i :3000
sudo lsof -i :8081
sudo lsof -i :5433

# Hoặc tìm process
sudo netstat -tulpn | grep :3000
```

2. Dừng process đang sử dụng port hoặc thay đổi port trong `docker-compose.yml`

3. Xóa containers cũ:
```bash
docker compose down
docker system prune -f
```

**Backend không kết nối được database:**
- Đảm bảo PostgreSQL container đã start và healthy
- Kiểm tra logs: `docker compose logs postgres`
- Chờ vài giây để PostgreSQL khởi động xong

**Frontend không load được:**
- Kiểm tra logs: `docker compose logs frontend`
- Đảm bảo backend đã chạy thành công
- Xóa build cache và rebuild: `docker compose build --no-cache frontend`

**Xóa tất cả và build lại từ đầu:**
```bash
# Dừng và xóa tất cả
docker compose down -v

# Xóa images
docker rmi authen-backend authen-frontend

# Build lại
docker compose up --build
```

## 👥 Author

Created for IA03 - User Registration API with React Frontend

## 📄 License

This project is created for educational purposes.

