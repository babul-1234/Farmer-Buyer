# AgroConnect - Direct Farmer to Buyer Agricultural Marketplace

A full-stack web application connecting farmers directly with buyers.

## Tech Stack
- **Frontend**: React (Vite), Pure CSS (Dark Theme)
- **Backend**: Node.js, Express.js, MySQL
- **Database**: MySQL

## Prerequisites
- Node.js installed
- MySQL Server installed and running

## Setup Instructions

### 1. Database Setup
1. Open your MySQL Workbench or Terminal.
2. Run the SQL script located at `backend/schema.sql`.
   - This will create the database `agroconnect` and necessary tables.
   - It also inserts some sample users.

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your MySQL credentials:
   ```env
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   npm start
   ```
   - Server runs on `http://localhost:5000`

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   - Application runs on `http://localhost:5173`

## Usage

### Users (Pre-seeded in schema.sql)
- **Admin**: admin@agro.com / password
- **Farmer**: farmer@agro.com / password
- **Buyer**: buyer@agro.com / password
(Note: Passwords in the seed are hashed. You might need to register new users to login if you cannot generate the hash manually, or use the Register page).

### Features
- **Register/Login**: Role-based authentication.
- **Farmer**: Add crops, view orders, manage listings.
- **Buyer**: Browse marketplace, filter by search, place orders, view history.
