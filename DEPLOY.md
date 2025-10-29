# 🚀 Hướng Dẫn Deploy với Nginx trên Server

## 📋 Yêu Cầu

- Server Ubuntu/Debian (IP: 68.183.235.95)
- SSH access vào server
- Domain name (hoặc dùng IP trực tiếp)
- Root hoặc sudo access

---

## Bước 1: SSH vào Server

```bash
ssh root@68.183.235.95
# hoặc
ssh your-username@68.183.235.95
```

---

## Bước 2: Cài Đặt Dependencies

### 2.1. Cài đặt Docker và Docker Compose

```bash
# Update package list
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
docker compose version

# Add user to docker group (optional, để không cần sudo)
sudo usermod -aG docker $USER
# Logout và login lại để áp dụng
```

### 2.2. Cài đặt Nginx

```bash
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
```

### 2.3. Cài đặt Git (nếu chưa có)

```bash
sudo apt install -y git
```

---

## Bước 3: Upload Code lên Server

### 3.1. Tạo thư mục project

```bash
# Tạo thư mục cho project
sudo mkdir -p /var/www/authen
sudo chown $USER:$USER /var/www/authen
cd /var/www/authen
```

### 3.2. Upload code (chọn 1 trong 2 cách)

**Cách 1: Clone từ Git repository**
```bash
git clone <your-repo-url> .
```

**Cách 2: Upload bằng SCP (từ máy local)**
```bash
# Từ máy local, chạy:
scp -r /home/fat/code/web-advance/authen/* root@68.183.235.95:/var/www/authen/

# Hoặc upload toàn bộ thư mục
scp -r /home/fat/code/web-advance/authen root@68.183.235.95:/var/www/
```

---

## Bước 4: Cấu Hình Docker Compose cho Production

Tạo file `docker-compose.prod.yml`:

```bash
cd /var/www/authen
nano docker-compose.prod.yml
```

Nội dung file (đã tạo sẵn trong project):

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: authen-postgres
    environment:
      POSTGRES_DB: authen_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-your_strong_password_here}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - authen-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./be
      dockerfile: Dockerfile
    container_name: authen-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/authen_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:-your_strong_password_here}
      SPRING_PROFILES_ACTIVE: docker
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - authen-network
    restart: unless-stopped
    # Không expose port ra ngoài, chỉ dùng internal network

  frontend:
    build:
      context: ./fe
      dockerfile: Dockerfile
    container_name: authen-frontend
    depends_on:
      - backend
    networks:
      - authen-network
    restart: unless-stopped
    # Không expose port ra ngoài, chỉ dùng internal network

volumes:
  postgres_data:

networks:
  authen-network:
    driver: bridge
```

**Lưu ý**: Thay `your_strong_password_here` bằng password mạnh cho PostgreSQL!

---

## Bước 5: Cấu Hình Nginx Reverse Proxy

### 5.1. Cấu hình Nginx cho application

```bash
sudo nano /etc/nginx/sites-available/authen
```

Nội dung file:

```nginx
server {
    listen 80;
    server_name 68.183.235.95;  # Thay bằng domain nếu có

    # Client max body size (cho upload files nếu cần)
    client_max_body_size 10M;

    # Frontend - Serve React app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API - Proxy to Spring Boot
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (nếu cần)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        
        # Handle preflight requests
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 5.2. Kích hoạt site

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/authen /etc/nginx/sites-enabled/

# Xóa default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Bước 6: Sửa Frontend để Dùng Nginx Proxy

Cần sửa file `fe/src/services/api.ts` để API URL sử dụng `/api` thay vì direct connection:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
```

Và cập nhật docker-compose để expose ports internal cho Nginx:

```yaml
# Trong docker-compose.prod.yml
frontend:
  ports:
    - "127.0.0.1:3000:80"  # Chỉ expose trên localhost

backend:
  ports:
    - "127.0.0.1:8080:8080"  # Chỉ expose trên localhost
```

---

## Bước 7: Build và Chạy Docker Containers

```bash
cd /var/www/authen

# Build và start containers
docker compose -f docker-compose.prod.yml up -d --build

# Kiểm tra containers đang chạy
docker compose -f docker-compose.prod.yml ps

# Xem logs
docker compose -f docker-compose.prod.yml logs -f
```

---

## Bước 8: Cấu Hình Firewall (UFW)

```bash
# Cho phép HTTP
sudo ufw allow 80/tcp

# Cho phép HTTPS (nếu có SSL)
sudo ufw allow 443/tcp

# Cho phép SSH (nếu chưa có)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Kiểm tra status
sudo ufw status
```

---

## Bước 9: Kiểm Tra Deployment

### 9.1. Kiểm tra containers

```bash
docker ps
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend
```

### 9.2. Test từ server

```bash
# Test frontend
curl http://localhost:3000

# Test backend API
curl http://localhost:8080/user/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test qua Nginx
curl http://localhost/api/user/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 9.3. Test từ browser

Truy cập: `http://68.183.235.95`

---

## Bước 10: SSL Certificate với Let's Encrypt (Optional nhưng Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (thay domain bằng domain của bạn)
sudo certbot --nginx -d your-domain.com

# Hoặc nếu chỉ dùng IP, có thể skip SSL hoặc dùng self-signed cert

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 📝 Các Lệnh Quản Lý Thường Dùng

### Xem logs
```bash
# Tất cả services
docker compose -f docker-compose.prod.yml logs -f

# Chỉ backend
docker compose -f docker-compose.prod.yml logs -f backend

# Chỉ frontend
docker compose -f docker-compose.prod.yml logs -f frontend

# Chỉ database
docker compose -f docker-compose.prod.yml logs -f postgres
```

### Restart services
```bash
# Restart tất cả
docker compose -f docker-compose.prod.yml restart

# Restart một service
docker compose -f docker-compose.prod.yml restart backend
```

### Update code và redeploy
```bash
cd /var/www/authen

# Pull code mới (nếu dùng git)
git pull

# Rebuild và restart
docker compose -f docker-compose.prod.yml up -d --build

# Nếu chỉ cần restart mà không cần rebuild
docker compose -f docker-compose.prod.yml restart
```

### Stop services
```bash
docker compose -f docker-compose.prod.yml down
```

### Backup database
```bash
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres authen_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 🔧 Troubleshooting

### Nginx không start
```bash
sudo nginx -t  # Test config
sudo systemctl status nginx
sudo journalctl -u nginx -n 50
```

### Containers không start
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs
```

### Port đã được sử dụng
```bash
sudo netstat -tulpn | grep :80
sudo lsof -i :80
```

### Database connection error
```bash
# Kiểm tra postgres container
docker compose -f docker-compose.prod.yml logs postgres

# Kiểm tra backend logs
docker compose -f docker-compose.prod.yml logs backend

# Test connection từ backend container
docker compose -f docker-compose.prod.yml exec backend ping postgres
```

### Frontend không load
```bash
# Kiểm tra frontend container
docker compose -f docker-compose.prod.yml logs frontend

# Test nginx proxy
curl -I http://localhost
curl -I http://localhost/api/health
```

---

## 🔒 Security Best Practices

1. **Đổi password mạnh cho PostgreSQL** trong `docker-compose.prod.yml`
2. **Cấu hình firewall** chỉ mở ports cần thiết
3. **Sử dụng SSL/HTTPS** với Let's Encrypt
4. **Giới hạn CORS** trong Nginx config (thay `*` bằng domain cụ thể)
5. **Backup database** thường xuyên
6. **Update system packages** định kỳ:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## 📊 Monitoring (Optional)

### Cài đặt monitoring tools
```bash
# Cài htop để monitor resources
sudo apt install -y htop

# Monitor Docker
docker stats
```

---

## ✅ Checklist Deployment

- [ ] SSH vào server thành công
- [ ] Docker và Docker Compose đã cài đặt
- [ ] Nginx đã cài đặt và chạy
- [ ] Code đã upload lên server
- [ ] `docker-compose.prod.yml` đã được cấu hình
- [ ] Nginx config đã được tạo và kích hoạt
- [ ] Frontend API URL đã được sửa thành `/api`
- [ ] Docker containers đã build và start thành công
- [ ] Firewall đã được cấu hình
- [ ] Test từ browser thành công
- [ ] SSL certificate đã được cài (optional)

---

## 🎉 Hoàn Thành!

Nếu mọi thứ đều OK, bạn có thể truy cập ứng dụng tại:
- **HTTP**: http://68.183.235.95
- **HTTPS** (nếu có SSL): https://68.183.235.95

