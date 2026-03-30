const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  category: { type: String, enum: ['auth', 'lead', 'system', 'client'], default: 'system' }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
