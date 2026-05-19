const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  contractNumber: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: {
    type: String,
    enum: ['service', 'vendor', 'employment', 'nda', 'partnership', 'lease', 'other'],
    default: 'service'
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'expired', 'terminated', 'renewed'],
    default: 'draft'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  value: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  description: { type: String },
  terms: { type: String },
  tags: [{ type: String }],
  attachments: [{ name: String, path: String, uploadedAt: { type: Date, default: Date.now } }],
  renewalReminder: { type: Number, default: 30 }, // days before expiry
  isRenewable: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [{ text: String, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

// Auto-generate contract number
contractSchema.pre('save', async function(next) {
  if (!this.contractNumber) {
    const count = await mongoose.model('Contract').countDocuments();
    this.contractNumber = `CNT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Auto-update status based on dates
contractSchema.pre('save', function(next) {
  const now = new Date();
  if (this.status !== 'terminated' && this.status !== 'draft' && this.status !== 'pending') {
    if (this.endDate < now) this.status = 'expired';
    else if (this.startDate <= now && this.endDate >= now) this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Contract', contractSchema);
