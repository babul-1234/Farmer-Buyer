# AgroConnect Deployment Guide

This guide describes how to deploy the AgroConnect application.

## Prerequisites
- A GitHub account.
- Accounts on [Vercel](https://vercel.com) (for frontend) and [Railway](https://railway.app) or [Render](https://render.com) (for backend + database).

## Part 1: Backend Deployment (Railway Recommended)

1.  **Push to GitHub**: Ensure your latest code is pushed to a GitHub repository.
2.  **Create Project on Railway**:
    - Log in to Railway.
    - Click "New Project" > "Deploy from GitHub repo".
    - Select your `Farmer` repository.
3.  **Configure Database**:
    - In your Railway project, click "New" > "Database" > "MySQL".
    - Once created, go to the "Connect" tab and copy the connection values (Host, User, Password, Database Name, Port).
4.  **Configure Service Variables**:
    - Click on your backend service card in Railway.
    - Go to "Variables".
    - Add the following variables:
        - `PORT`: `7000` (or `8080` if Railway expects that)
        - `DB_HOST`: (Paste from MySQL service)
        - `DB_USER`: (Paste from MySQL service)
        - `DB_PASSWORD`: (Paste from MySQL service)
        - `DB_NAME`: (Paste from MySQL service)
        - `DB_PORT`: (Paste from MySQL service)
        - `JWT_SECRET`: (Generate a strong random string)
5.  **Build Command**:
    - Go to "Settings" > "Build".
    - Root Directory: `backend`
    - Build Command: `npm install`
    - Start Command: `node server.js`

## Part 2: Frontend Deployment (Vercel)

1.  **Import Project**:
    - Log in to Vercel.
    - Click "Add New..." > "Project".
    - Import your `Farmer` repository.
2.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: Click "Edit" and select `frontend`.
3.  **Environment Variables**:
    - Expand "Environment Variables".
    - Add `VITE_API_URL`.
    - Value: The URL of your deployed backend from Part 1 (e.g., `https://agroconnect-backend.up.railway.app/api`). **Important**: Do not add a trailing slash.
4.  **Deploy**:
    - Click "Deploy".
    - Vercel will build your project. Once done, you will get a live URL for your frontend.

## Part 3: Database Initialization

Since the production database is empty, you need to set up the tables.
1.  Connect to your remote database using a tool like **MySQL Workbench** or **DBeaver** using the credentials from Railway.
2.  Open the `backend/schema.sql` file from your local project.
3.  Run the SQL queries in your remote database to create the necessary tables.

## Verification
- Open your Vercel URL.
- Try to Register a new account.
- If successful, your core full-stack flow is working!
