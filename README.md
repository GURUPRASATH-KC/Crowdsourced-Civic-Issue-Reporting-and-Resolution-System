# Crowdsourced Civic Issue Reporting System

A full-stack web application for citizens to report civic issues and admins to manage them.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS v4, React-Leaflet, Axios, React Router v6
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT Auth, Multer (Local File Uploads)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in `server/.env`.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(Server runs on http://localhost:5000)*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(Frontend usually runs on http://localhost:5173)*

## Usage Guide
1. **Citizen Flow**: Register a new account as a "Citizen". Log in, go to "Report Issue", click on the map to drop a pin, fill the details (you can upload a photo), and submit.
2. **Upvoting**: Log in as a different Citizen account and click "View details" on an issue. Click the "Confirm Issue Exists" button to increase its priority score.
3. **Admin Flow**: Register a new account and select "Administrator" role. Log in, go to "Dashboard", filter issues, assign departments, and update the status to "In Progress" or "Resolved".
