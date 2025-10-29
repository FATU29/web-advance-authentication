#!/bin/bash

# Deployment Script for Nginx + Docker Setup
# Chạy script này trên server sau khi SSH vào

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Variables
PROJECT_DIR="/var/www/authen"
NGINX_SITE="/etc/nginx/sites-available/authen"
NGINX_ENABLED="/etc/nginx/sites-enabled/authen"

echo -e "${GREEN}Step 1: Installing dependencies...${NC}"

# Update package list
apt update

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl start docker
    systemctl enable docker
else
    echo "Docker is already installed"
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
else
    echo "Nginx is already installed"
fi

# Install Git if not installed
if ! command -v git &> /dev/null; then
    apt install -y git
fi

echo -e "${GREEN}Step 2: Setting up project directory...${NC}"

# Create project directory
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

echo -e "${YELLOW}NOTE: Please upload your code to $PROJECT_DIR${NC}"
echo -e "${YELLOW}You can use: scp -r /path/to/local/authen/* root@68.183.235.95:$PROJECT_DIR/${NC}"
read -p "Press Enter after uploading code..."

echo -e "${GREEN}Step 3: Configuring Nginx...${NC}"

# Copy Nginx config if it exists in project
if [ -f "$PROJECT_DIR/nginx-server.conf" ]; then
    cp $PROJECT_DIR/nginx-server.conf $NGINX_SITE
    echo "Nginx config copied from project"
else
    echo "Creating Nginx config..."
    cat > $NGINX_SITE << 'EOF'
server {
    listen 80;
    server_name 68.183.235.95;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
EOF
fi

# Enable site
ln -sf $NGINX_SITE $NGINX_ENABLED

# Remove default site
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

echo -e "${GREEN}Step 4: Setting up firewall...${NC}"

# Install UFW if not installed
if ! command -v ufw &> /dev/null; then
    apt install -y ufw
fi

# Configure firewall
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw --force enable

echo -e "${GREEN}Step 5: Building and starting Docker containers...${NC}"

cd $PROJECT_DIR

# Use production compose file if exists
if [ -f "docker-compose.prod.yml" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
    echo -e "${YELLOW}Warning: Using docker-compose.yml instead of docker-compose.prod.yml${NC}"
fi

# Build and start containers
docker compose -f $COMPOSE_FILE up -d --build

# Wait a bit for services to start
echo "Waiting for services to start..."
sleep 10

# Check container status
docker compose -f $COMPOSE_FILE ps

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Check logs: docker compose -f $COMPOSE_FILE logs -f"
echo "2. Test: curl http://localhost"
echo "3. Access: http://68.183.235.95"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo "- Change PostgreSQL password in docker-compose.prod.yml"
echo "- Set up SSL certificate with Let's Encrypt (optional)"

