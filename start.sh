#!/bin/bash

echo "🚀 Starting User Registration System..."
echo ""
echo "Building and starting all services with Docker Compose..."
echo ""

docker-compose up --build

echo ""
echo "✅ Application started successfully!"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8080"
echo ""

