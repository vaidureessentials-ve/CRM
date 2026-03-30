const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followUpDate: { type: Date, required: true },
    notes: { type: String },
    status: { type: String, enum: ['Pending', 'Done', 'Missed'], default: 'Pending' },
    contactName: { type: String },
    contactPhone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', FollowUpSchema);
