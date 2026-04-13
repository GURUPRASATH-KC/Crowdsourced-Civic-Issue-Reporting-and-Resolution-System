# CivicReporter 🏙️

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://crowdsourced-civic-issue-reporting-five.vercel.app/)

**CivicReporter** is a crowdsourced community issue reporting and resolution platform. It empowers citizens to easily report local infrastructure problems (like potholes, broken streetlights, or water issues) with photographic evidence and exact geo-locations, while allowing authorities to monitor and resolve them efficiently.

## ✨ Features

- **📍 Geo-Tagging:** Pinpoint exact issue locations using an interactive map (Leaflet).
- **📸 Photo Evidence:** Upload photos of civic issues with built-in client-side compression to ensure fast, reliable uploads.
- **✨ Premium UI/UX:** A modern, glassmorphic interface built with TailwindCSS and smooth animations powered by Framer Motion.
- **👍 Community Upvoting:** Users can upvote existing issues to increase visibility and prioritize resolution.
- **🗺️ Map & Grid Views:** Toggle between a standard grid layout and a dynamic map view to see issues around your city.
- **🛡️ Admin Dashboard:** Dedicated admin roles to update issue statuses (Pending, In Progress, Resolved).

## 🛠️ Tech Stack

### Frontend
- **React.js** (via Vite)
- **TailwindCSS** (Styling & theming)
- **Framer Motion** (Layout animations & micro-interactions)
- **React Leaflet** (Interactive maps)
- **React Hot Toast** (Notifications)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database)
- **JSON Web Tokens (JWT)** (Authentication)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Cluster (or local MongoDB Compass instance)

### 1. Clone the repository
```bash
git clone https://github.com/GURUPRASATH-KC/Crowdsourced-Civic-Issue-Reporting-and-Resolution-System.git
cd Crowdsourced-Civic-Issue-Reporting-and-Resolution-System
```

### 2. Setup the Backend
Open a terminal and navigate to the server folder:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Start the server:
```bash
npm run start
```

### 3. Setup the Frontend
Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```
Start the Vite development server:
```bash
npm run dev
```

## 📂 Project Structure

```
.
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, IssueCard, etc.)
│   │   ├── pages/          # Application views (Home, ReportIssue, Auth pages)
│   │   ├── services/       # API integration
│   │   └── index.css       # Global styles & Tailwind config
│   └── vite.config.js
│
└── server/                 # Node/Express backend application
    ├── models/             # Mongoose schemas (User, Issue)
    ├── server.js           # Main Express application & routes
    └── .env                # Backend environment variables
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/GURUPRASATH-KC/Crowdsourced-Civic-Issue-Reporting-and-Resolution-System/issues).


