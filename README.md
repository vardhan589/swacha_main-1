# Swacha - Community Waste Management App

Swacha is a community-driven waste management application that empowers citizens to report and track waste in their neighborhoods. By gamifying the process with "Eco Karma" points and a public leaderboard, Swacha encourages active participation in maintaining a clean environment.

## 🚀 App Concept

The core concept of Swacha revolves around crowdsourcing waste reporting. Users can:
- **Report Waste**: Identify and report various types of waste (Plastic, Organic, Hazardous, E-Waste, etc.) with precise location coordinates.
- **Earn Rewards**: Gain "Eco Karma" points for every verified report, encouraging continuous engagement.
- **Track Cleaning**: Monitor the status of reported waste (Pending vs. Cleaned).
- **Leaderboard**: Compete with other eco-warriors in the community to climb the leaderboard.

## 🏗️ Architecture

The project is built using a modern, scalable MERN (MongoDB, Express, React, Node.js) stack, enhanced with mobile capabilities via Capacitor.

### Frontend
- **Framework**: React.js with Vite for fast building and hot module replacement.
- **Mobile Integration**: Capacitor is used to access native device features like the camera (for capturing waste photos) and geolocation (for accurate reporting).
- **UI/UX**: Responsive design with `react-hot-toast` for notifications and `recharts` for data visualization.
- **Routing**: `react-router-dom` for seamless single-page application navigation.

### Backend
- **Framework**: Node.js with Express.js.
- **Database**: MongoDB (via Mongoose) for persistent storage of reports and user data. Includes an intelligent in-memory fallback mechanism if the database connection fails, ensuring the app remains functional for demonstrations.
- **API Endpoints**:
  - `GET /api/reports`: Fetch all waste reports.
  - `POST /api/reports`: Submit a new waste report.
  - `PUT /api/reports/:id/clean`: Update a report's status to "cleaned".
  - `GET /api/leaderboard`: Fetch the top users based on their Eco Karma.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (Optional, local or Atlas URI)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The server runs on port 5000 by default. It will connect to MongoDB or use a fallback in-memory datastore if MongoDB is unavailable.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the app in your browser at `http://localhost:5173`.

## 📱 Mobile Deployment (Android)
Since the app uses Capacitor, you can easily build it for Android:
1. Build the frontend: `npm run build`
2. Sync with Capacitor: `npx cap sync android`
3. Open in Android Studio: `npx cap open android`

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
