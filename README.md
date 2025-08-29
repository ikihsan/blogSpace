# FathiVlog Platform - Deployment Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (a free one can be created on Render)
- Render account
- Git and a GitHub account

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd fathivlog
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    
    # Create a .env file from the example
    cp .env.example .env 
    
    # Edit .env with your local configuration. 
    # For local development, you can use a local PostgreSQL database.
    # Example for local DB: DATABASE_URL=postgres://user:password@localhost:5432/fathivlog
    
    npm run dev 
    # The backend server will start on http://localhost:5000
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    
    # Create a .env file
    cp .env.example .env
    
    # Edit .env to point to your local backend
    # REACT_APP_API_URL=http://localhost:5000/api
    
    npm start
    # The frontend app will open on http://localhost:3000
    ```

4.  **Admin Panel Setup:**
    ```bash
    cd ../admin
    npm install
    
    # Create a .env file
    cp .env.example .env
    
    # Edit .env to point to your local backend
    # REACT_APP_API_URL=http://localhost:5000/api
    
    npm start
    # The admin panel will open on http://localhost:3001
    ```

## Render Deployment

### 1. Database Setup
1.  Go to your Render Dashboard.
2.  Click **New** → **PostgreSQL**.
3.  Configure your database:
    -   **Name**: `fathivlog-db` (or any name you prefer)
    -   **Region**: Choose a region close to you.
    -   **Plan**: Free plan is sufficient for starting out.
4.  Click **Create Database**.
5.  Once created, go to the database's page and copy the **Internal Database URL**. You will need this for the backend.

### 2. Backend Deployment
1.  Push your complete code to your GitHub repository.
2.  In the Render Dashboard, click **New** → **Web Service**.
3.  Connect the GitHub repository you just pushed to.
4.  Configure the web service:
    -   **Environment**: Node
    -   **Root Directory**: `fathivlog/backend`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
    -   **Plan**: Free
5.  Go to the **Environment** tab and add the following environment variables:
    -   `DATABASE_URL`: Paste the Internal Database URL you copied from your Render PostgreSQL instance.
    -   `JWT_SECRET`: A long, random, secret string.
    -   `ADMIN_EMAIL`: Your desired admin email.
    -   `ADMIN_PASSWORD`: A strong password for the admin user.
    -   `SESSION_SECRET`: Another long, random, secret string.
    -   `CORS_ORIGIN`: The URLs of your deployed frontend and admin sites (you'll get these in the next steps, you can add them later). For now, you can use `https://*.onrender.com`.
    -   `NODE_ENV`: `production`
6.  Click **Create Web Service**. Render will build and deploy your backend.

### 3. Frontend Deployment
1.  In the Render Dashboard, click **New** → **Static Site**.
2.  Connect the same GitHub repository.
3.  Configure the static site:
    -   **Root Directory**: `fathivlog/frontend`
    -   **Build Command**: `npm install && npm run build`
    -   **Publish Directory**: `build`
4.  Add an environment variable:
    -   `REACT_APP_API_URL`: The URL of your deployed backend service (e.g., `https://fathivlog-backend.onrender.com/api`).
5.  Click **Create Static Site**.

### 4. Admin Panel Deployment
1.  Create another **Static Site** on Render for the admin panel.
2.  Connect the same GitHub repository.
3.  Configure this static site:
    -   **Root Directory**: `fathivlog/admin`
    -   **Build Command**: `npm install && npm run build`
    -   **Publish Directory**: `build`
4.  Add an environment variable:
    -   `REACT_APP_API_URL`: The same URL of your deployed backend service.
5.  Click **Create Static Site**.

### 5. Final Configuration
-   Go back to your **backend service's environment variables** on Render.
-   Update `CORS_ORIGIN` to include the specific URLs of your deployed frontend and admin sites, separated by a comma if needed (e.g., `https://fathivlog-frontend.onrender.com,https://fathivlog-admin.onrender.com`). This is more secure.

Your FathiVlog platform is now live!
