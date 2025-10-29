# User Registration System

User registration and authentication system với Spring Boot backend và React frontend.

## Features

### Backend
- User registration API
- PostgreSQL database
- Password hashing với BCrypt
- Input validation và error handling
- CORS configuration

### Frontend
- Material-UI components
- Form validation với React Hook Form và Zod
- API integration với React Query
- 3 pages: Home, Login, Sign Up

## Requirements

- Docker và Docker Compose

## Setup và Chạy

1. Cài Docker và Docker Compose nếu chưa có

2. Chạy ứng dụng:
```bash
cd authen
docker compose up --build
```

3. Truy cập:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8081

4. Dừng ứng dụng:
```bash
docker compose down
```

## API Endpoints

### POST /user/register

Register user mới.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": "user@example.com"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "User with email user@example.com already exists"
}
```

## Project Structure

```
authen/
├── be/              # Spring Boot backend
├── fe/              # React frontend
├── docker-compose.yml
└── README.md
```

## Tech Stack

**Backend:** Spring Boot 3.2.0, Spring Data JPA, Spring Security, PostgreSQL, Maven

**Frontend:** React 18, TypeScript, React Router, React Hook Form, Zod, React Query, Material-UI

**DevOps:** Docker, Docker Compose, Nginx

## Deployment

Để deploy lên server với Nginx:

1. Xem [DEPLOY_QUICK.md](./DEPLOY_QUICK.md) hoặc [DEPLOY.md](./DEPLOY.md)

2. Upload code lên server và chạy:
```bash
ssh root@68.183.235.95
cd /var/www/authen
sudo ./deploy.sh
```

## Troubleshooting

- Port bị conflict: đổi port trong `docker-compose.yml` hoặc dừng process đang dùng port đó
- Database connection error: kiểm tra logs `docker compose logs postgres`
- Frontend không load: kiểm tra logs `docker compose logs frontend`
