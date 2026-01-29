#!/bin/bash

echo "Stopping Khanathikana Restaurant Management System..."

# Kill backend process
echo "Stopping Backend Server..."
pkill -f "spring-boot:run"

# Kill frontend process
echo "Stopping Frontend Server..."
pkill -f "next dev"

echo "Application stopped successfully!"
