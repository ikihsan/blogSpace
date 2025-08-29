#!/bin/bash

# Startup script for Render deployment
echo "Starting deployment checks..."

# Check current directory structure
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if builds exist
echo "Checking for frontend build..."
if [ -d "frontend/build" ]; then
    echo "✅ Frontend build found"
    ls -la frontend/build/
else
    echo "❌ Frontend build not found"
    echo "Contents of frontend directory:"
    ls -la frontend/ || echo "Frontend directory not found"
fi

echo "Checking for admin build..."
if [ -d "admin/build" ]; then
    echo "✅ Admin build found"
    ls -la admin/build/
else
    echo "❌ Admin build not found"
    echo "Contents of admin directory:"
    ls -la admin/ || echo "Admin directory not found"
fi

# Start the server
echo "Starting server..."
cd backend && npm start
