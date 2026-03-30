const mongoose = require('mongoose');

const FreeTrialSchema = new mongoose.Schema({
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Expired', 'Converted'], default: 'Active' },
    notes: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('FreeTrial', FreeTrialSchema);
