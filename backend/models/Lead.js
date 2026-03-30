const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    company: { type: String },
    status: { type: String, enum: ['Unread', 'Read', 'Converted', 'Disposed'], default: 'Unread' },
    source: { type: String, default: 'Fresh Pool' },
    segment: { type: String, default: 'Fresh Pool' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
