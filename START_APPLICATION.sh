#!/bin/bash

echo "Starting Khanathikana Restaurant Management System..."

# Start Backend
echo "Starting Backend Server..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 10

# Start Frontend
echo "Starting Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Application started successfully!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Backend API at: http://localhost:8080"
echo ""
echo "To stop the application, run: ./STOP_APPLICATION.sh"
