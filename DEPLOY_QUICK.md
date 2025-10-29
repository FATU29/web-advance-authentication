# 🚀 Hướng Dẫn Deploy Nhanh

## Bước 1: SSH vào Server

```bash
ssh root@68.183.235.95
```

## Bước 2: Upload Code lên Server

Từ máy local của bạn:

```bash
# Upload toàn bộ project
scp -r /home/fat/code/web-advance/authen root@68.183.235.95:/var/www/
```

Hoặc sử dụng rsync (tốt hơn, bỏ qua file không cần):

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /home/fat/code/web-advance/authen/ root@68.183.235.95:/var/www/authen/
```

## Bước 3: Chạy Script Deploy Tự Động (Recommended)

```bash
# SSH vào server
ssh root@68.183.235.95

# Di chuyển vào thư mục
cd /var/www/authen

# Chạy script deploy
chmod +x deploy.sh
sudo ./deploy.sh
```

Script sẽ tự động:
- ✅ Cài Docker và Nginx
- ✅ Cấu hình Nginx
- ✅ Build và start Docker containers
- ✅ Cấu hình firewall

## Bước 4: Deploy Thủ Công (Nếu không dùng script)

### 4.1. Cài đặt Dependencies

```bash
# Update và cài Docker
sudo apt update
sudo apt install -y docker.io docker-compose nginx git

# Start services
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.2. Cấu hình Nginx

```bash
cd /var/www/authen

# Copy Nginx config
sudo cp nginx-server.conf /etc/nginx/sites-available/authen

# Enable site
sudo ln -s /etc/nginx/sites-available/authen /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Xóa default

# Test và reload
sudo nginx -t
sudo systemctl reload nginx
```

### 4.3. Đổi Password PostgreSQL

```bash
cd /var/www/authen
nano docker-compose.prod.yml

# Thay đổi: POSTGRES_PASSWORD và SPRING_DATASOURCE_PASSWORD
# Tìm: change_this_password
# Thay bằng password mạnh của bạn
```

### 4.4. Build và Start Containers

```bash
cd /var/www/authen

# Build và start
docker compose -f docker-compose.prod.yml up -d --build

# Kiểm tra status
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

### 4.5. Cấu hình Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS (nếu có SSL)
sudo ufw enable
```

## Bước 5: Kiểm Tra

### Test từ server:

```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:8080/user/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test qua Nginx
curl http://localhost
curl http://localhost/api/user/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test từ browser:

Truy cập: **http://68.183.235.95**

## Các Lệnh Quản Lý

```bash
cd /var/www/authen

# Xem logs
docker compose -f docker-compose.prod.yml logs -f

# Restart services
docker compose -f docker-compose.prod.yml restart

# Update code (sau khi pull/push code mới)
docker compose -f docker-compose.prod.yml up -d --build

# Stop services
docker compose -f docker-compose.prod.yml down

# Restart Nginx
sudo systemctl restart nginx
```

## SSL Certificate (Optional)

```bash
# Cài Certbot
sudo apt install -y certbot python3-certbot-nginx

# Lấy SSL certificate (cần domain name)
sudo certbot --nginx -d your-domain.com

# Hoặc tự động renew
sudo certbot renew
```

## Troubleshooting

### Containers không start:

```bash
docker compose -f docker-compose.prod.yml logs
docker compose -f docker-compose.prod.yml ps
```

### Nginx lỗi:

```bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx -n 50
```

### Port đã được sử dụng:

```bash
sudo netstat -tulpn | grep :80
sudo lsof -i :80
```

### Database connection error:

```bash
docker compose -f docker-compose.prod.yml logs postgres
docker compose -f docker-compose.prod.yml logs backend
```

---

## ✅ Checklist

- [ ] SSH vào server thành công
- [ ] Code đã upload lên `/var/www/authen`
- [ ] Docker và Nginx đã cài đặt
- [ ] Nginx config đã được tạo và enable
- [ ] PostgreSQL password đã được đổi
- [ ] Docker containers đã build và start
- [ ] Firewall đã được cấu hình
- [ ] Test thành công từ browser: http://68.183.235.95

---

Xem file `DEPLOY.md` để có hướng dẫn chi tiết hơn!

