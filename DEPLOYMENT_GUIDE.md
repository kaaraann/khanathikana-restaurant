# Khanathikana Restaurant Management System - Render Deployment Guide

## Overview
This guide will help you deploy the Khanathikana Restaurant Management System on Render.com.

## Prerequisites
- Render.com account (Free tier is sufficient)
- GitHub repository with your code
- Basic understanding of web services

## Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Repository Structure**
   ```
   khanathikana/
   ├── backend/
   │   ├── src/
   │   ├── pom.xml
   │   └── render.yaml
   ├── frontend/
   │   ├── src/
   │   ├── package.json
   │   └── render.yaml
   ├── render.yaml (main configuration)
   └── DEPLOYMENT_GUIDE.md
   ```

## Step 2: Deploy to Render

### Option A: Using the Main render.yaml (Recommended)

1. **Go to Render Dashboard**
   - Login to [render.com](https://render.com)
   - Click "New" → "Web Service"

2. **Connect Your Repository**
   - Connect your GitHub account
   - Select the `khanathikana-restaurant` repository
   - Choose the `main` branch

3. **Configure Services**
   - Render will automatically detect the `render.yaml` file
   - It will create:
     - `khanathikana-backend` (Spring Boot API)
     - `khanathikana-frontend` (Next.js App)
     - `khanathikana-db` (PostgreSQL Database)

### Option B: Manual Setup

#### Backend Service
1. **Create Web Service**
   - Name: `khanathikana-backend`
   - Environment: `Maven`
   - Build Command: `cd backend && mvn clean package -DskipTests`
   - Start Command: `cd backend && java -jar target/khanathikana-backend-1.0.0.jar`

2. **Environment Variables**
   ```
   JAVA_VERSION=17
   SPRING_DATASOURCE_URL=[From Database]
   SPRING_DATASOURCE_USERNAME=[From Database]
   SPRING_DATASOURCE_PASSWORD=[From Database]
   JWT_SECRET=[Generate or set your own]
   JWT_EXPIRATION=86400000
   ```

#### Frontend Service
1. **Create Web Service**
   - Name: `khanathikana-frontend`
   - Environment: `Node`
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm start`

2. **Environment Variables**
   ```
   NODE_VERSION=18
   NEXT_PUBLIC_API_URL=https://khanathikana-backend.onrender.com
   ```

#### Database
1. **Create PostgreSQL Database**
   - Name: `khanathikana-db`
   - Plan: Free
   - Database Name: `khanathikana`

## Step 3: Configure Environment Variables

### Backend Environment Variables
- `SPRING_DATASOURCE_URL`: Get from Render database dashboard
- `SPRING_DATASOURCE_USERNAME`: Get from Render database dashboard  
- `SPRING_DATASOURCE_PASSWORD`: Get from Render database dashboard
- `JWT_SECRET`: Generate a secure secret key
- `JWT_EXPIRATION`: 86400000 (24 hours)

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://khanathikana-backend.onrender.com`)

## Step 4: Health Checks and Monitoring

### Backend Health Check
- Health check endpoint: `/actuator/health`
- Custom health endpoint: `/api/health`
- Render will automatically monitor this endpoint

### Frontend Health Check
- Health check path: `/`

## Step 5: Access Your Application

After deployment:

1. **Backend API**: `https://khanathikana-backend.onrender.com`
2. **Frontend App**: `https://khanathikana-frontend.onrender.com`
3. **Database**: Available via Render dashboard

## Step 6: Test the Application

1. **Check Backend Health**
   ```bash
   curl https://khanathikana-backend.onrender.com/api/health
   ```

2. **Test API Endpoints**
   - Categories: `https://khanathikana-backend.onrender.com/api/categories`
   - Tables: `https://khanathikana-backend.onrender.com/api/tables`

3. **Access Frontend**
   - Open `https://khanathikana-frontend.onrender.com` in your browser

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure Java 17 is specified
   - Verify Maven dependencies

2. **Database Connection Issues**
   - Verify database credentials
   - Check if database is running
   - Ensure SSL is enabled for PostgreSQL

3. **Frontend API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` environment variable
   - Check CORS configuration in backend
   - Ensure backend is running

4. **Health Check Failures**
   - Verify health endpoints are accessible
   - Check if services are running
   - Review service logs

### Logs and Monitoring

- **Backend Logs**: Available in Render dashboard
- **Frontend Logs**: Available in Render dashboard
- **Database Logs**: Available in Render dashboard

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Render's environment variable management
   - Rotate secrets regularly

2. **Database Security**
   - Use SSL connections
   - Limit database access
   - Regular backups

3. **API Security**
   - JWT tokens are configured
   - CORS is properly configured
   - Input validation is enabled

## Scaling

### Free Tier Limitations
- 750 hours/month per service
- 100GB bandwidth/month
- Shared CPU

### Upgrading
- Upgrade to paid plans for better performance
- Add more instances for scaling
- Consider Redis for caching

## Maintenance

### Regular Tasks
- Monitor service health
- Update dependencies
- Backup database
- Review logs

### Updates
- Push code changes to GitHub
- Render will auto-deploy
- Monitor deployment logs

## Support

- Render Documentation: https://render.com/docs
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- Next.js Documentation: https://nextjs.org/docs

---

**Note**: This deployment uses Render's free tier. For production use, consider upgrading to paid plans for better performance and reliability.
