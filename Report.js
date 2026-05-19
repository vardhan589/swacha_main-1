const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['pending', 'cleaned'], default: 'pending' },
  reporter: { type: String, required: true },
  eco_karma: { type: Number, default: 40 },
  photo: { type: String }, // Base64 string
  address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
