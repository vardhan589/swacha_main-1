const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Report = require('./models/Report');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initial data for fallback/demo
const INITIAL_REPORTS = [
  { id: 1, lat: 12.9716, lng: 77.5946, type: "Plastic", status: "pending", reporter: "Ravi K.", eco_karma: 40, timestamp: Date.now() - 86400000 * 2, address: "Cubbon Park, Bengaluru" },
  { id: 2, lat: 12.9352, lng: 77.6245, type: "Mixed", status: "cleaned", reporter: "Asha M.", eco_karma: 40, timestamp: Date.now() - 86400000 * 5, address: "Koramangala, Bengaluru" },
  { id: 3, lat: 13.0035, lng: 77.5846, type: "Hazardous", status: "pending", reporter: "Deepak S.", eco_karma: 50, timestamp: Date.now() - 3600000 * 6, address: "Hebbal, Bengaluru" },
  { id: 4, lat: 12.9082, lng: 77.6476, type: "Organic", status: "cleaned", reporter: "Priya R.", eco_karma: 40, timestamp: Date.now() - 86400000 * 1, address: "Jayanagar, Bengaluru" },
  { id: 5, lat: 12.9784, lng: 77.6408, type: "Construction", status: "pending", reporter: "Arjun T.", eco_karma: 45, timestamp: Date.now() - 3600000 * 12, address: "Indiranagar, Bengaluru" },
  { id: 6, lat: 12.9592, lng: 77.6974, type: "E-Waste", status: "pending", reporter: "Lakshmi N.", eco_karma: 50, timestamp: Date.now() - 86400000 * 3, address: "Whitefield, Bengaluru" },
];

const LEADERBOARD_USERS = [
  { name: "Priya R.", karma: 340, reports: 8, badge: "🌳" },
  { name: "Ravi K.", karma: 280, reports: 7, badge: "🌿" },
  { name: "Asha M.", karma: 220, reports: 5, badge: "🍃" },
  { name: "Deepak S.", karma: 190, reports: 4, badge: "🌱" },
  { name: "You", karma: 0, reports: 0, badge: "🌾" }
];

let fallbackReports = [...INITIAL_REPORTS];
let fallbackLeaderboard = [...LEADERBOARD_USERS];
let useFallback = false;

// Routes
app.get('/api/reports', async (req, res) => {
  if (useFallback) return res.json(fallbackReports);
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports.length > 0 ? reports : fallbackReports);
  } catch (error) {
    res.json(fallbackReports);
  }
});

app.post('/api/reports', async (req, res) => {
  if (useFallback) {
    const newReport = { ...req.body, id: Date.now(), status: 'pending', timestamp: Date.now() };
    fallbackReports.unshift(newReport);
    return res.status(201).json(newReport);
  }
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reports/:id/clean', async (req, res) => {
  if (useFallback) {
    fallbackReports = fallbackReports.map(r => (r.id == req.params.id || r._id == req.params.id) ? { ...r, status: 'cleaned' } : r);
    return res.json({ message: 'Marked clean' });
  }
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'cleaned' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/leaderboard', (req, res) => {
  res.json(fallbackLeaderboard);
});

// Start Server
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/swacha';

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Swacha Server running on port ${PORT}`));
  })
  .catch(err => {
    console.log('⚠️ MongoDB Connection Failed. Running with fallback in-memory data.');
    useFallback = true;
    app.listen(PORT, () => console.log(`🚀 Swacha Server (Fallback Mode) running on port ${PORT}`));
  });
