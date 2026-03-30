const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String },
    phone: { type: String, required: true }, // The phone number to call via SIP
    email: { type: String },
    status: { type: String, enum: ['Lead', 'Active', 'Inactive'], default: 'Lead' },
    notes: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);
