const mongoose = require('mongoose');

const CallLogSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    duration: { type: Number, default: 0 }, // Duration in seconds
    status: { type: String, enum: ['Completed', 'Missed', 'Failed'], default: 'Completed' },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CallLog', CallLogSchema);
