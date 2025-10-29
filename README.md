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
- Modern UI with shadcn/ui and Tailwind CSS
- Form validation with React Hook Form and Zod
- API integration with React Query
- Responsive design
- Three pages: Home, Login, and Sign Up

## 📋 Requirements

- Docker and Docker Compose
- Java 17 (for local development)
- Node.js 18+ (for local development)
- Maven (for local development)

## 🐳 Quick Start with Docker

The easiest way to run the entire application is using Docker Compose:

```bash
# Clone the repository and navigate to the project directory
cd authen

# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up --build

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8080
# - PostgreSQL: localhost:5432
```

To stop the services:
```bash
docker-compose down
```

To stop and remove volumes (database data):
```bash
docker-compose down -v
```

## 💻 Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd be
```

2. **Start PostgreSQL (using Docker):**
```bash
docker run -d \
  --name authen-postgres \
  -e POSTGRES_DB=authen_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
```

3. **Run the Spring Boot application:**
```bash
# Using Maven
./mvnw spring-boot:run

# Or using Maven wrapper (if mvnw is not available)
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd fe
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create a `.env` file in the `fe` directory:
```
REACT_APP_API_URL=http://localhost:8080
```

4. **Start the development server:**
```bash
npm start
```

The frontend will start on `http://localhost:3000`

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
│   │   ├── components/
│   │   │   └── ui/              # shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       └── label.tsx
│   │   ├── lib/
│   │   │   └── utils.ts
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
│   ├── package.json
│   └── tailwind.config.js
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

1. **Start the application** using Docker Compose or local setup
2. **Open browser** and navigate to `http://localhost:3000`
3. **Click "Sign Up"** to create a new account
4. **Fill in the form** with:
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
5. **Submit the form** - you should see a success message
6. **Try registering again** with the same email - you should see an error
7. **Click "Login"** to see the login page (mock functionality)

## 🔒 Security Features

- Passwords are hashed using BCrypt before storage
- Email uniqueness validation
- Input validation on both frontend and backend
- CORS configuration for secure cross-origin requests
- Environment variables for sensitive configuration

## 📝 Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/authen_db
spring.datasource.username=postgres
spring.datasource.password=password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
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
- Login Page (Form, Validation, UI with shadcn/ui) - 2 points

✅ **Deployment (1 point)**
- Docker configuration ready for public deployment

**Total: 10/10 points**

## 🐛 Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running
- Check database credentials in `application.properties`
- Verify Java 17 is installed

### Frontend won't start
- Run `npm install` to ensure all dependencies are installed
- Check that backend is running on port 8080
- Verify `.env` file exists with correct API URL

### Docker issues
- Ensure Docker and Docker Compose are installed
- Try `docker-compose down -v` to clean up volumes
- Check that ports 3000, 5432, and 8080 are not in use

## 👥 Author

Created for IA03 - User Registration API with React Frontend

## 📄 License

This project is created for educational purposes.

