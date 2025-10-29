# Quick Start Guide

## 🚀 Run with Docker (Recommended)

```bash
# Start everything
docker-compose up --build

# Or use the helper script
./start.sh
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## 🛑 Stop the Application

```bash
# Stop all services
docker-compose down

# Or use the helper script
./stop.sh

# Stop and remove database data
docker-compose down -v
```

## 💻 Run Locally (Without Docker)

### 1. Start PostgreSQL
```bash
docker run -d \
  --name authen-postgres \
  -e POSTGRES_DB=authen_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
```

### 2. Start Backend
```bash
cd be
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd fe
npm install
npm start
```

## 🧪 Test the Application

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Register with:
   - Email: test@example.com
   - Password: password123
4. Submit and verify success message
5. Try the Login page

## 📝 API Testing with curl

```bash
# Register a new user
curl -X POST http://localhost:8080/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Expected response:
# {"success":true,"message":"User registered successfully","data":"test@example.com"}
```

## 🔧 Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :8080  # Backend
lsof -i :5432  # PostgreSQL

# Kill the process
kill -9 <PID>
```

### Clean Docker environment
```bash
docker-compose down -v
docker system prune -a
```

### Frontend build issues
```bash
cd fe
rm -rf node_modules package-lock.json
npm install
```

### Backend build issues
```bash
cd be
mvn clean install
```

## 📦 Build for Production

### Backend JAR
```bash
cd be
mvn clean package
# JAR file will be in target/authen-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Build
```bash
cd fe
npm run build
# Build files will be in build/
```

## 🌐 Deploy to Cloud

The application is containerized and ready for deployment:

```bash
# Build images
docker-compose build

# Tag images for your registry
docker tag authen-backend:latest your-registry/authen-backend:latest
docker tag authen-frontend:latest your-registry/authen-frontend:latest

# Push to registry
docker push your-registry/authen-backend:latest
docker push your-registry/authen-frontend:latest
```

## 📊 Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🔍 Database Access

```bash
# Connect to PostgreSQL
docker exec -it authen-postgres psql -U postgres -d authen_db

# List users
SELECT * FROM users;

# Exit
\q
```

