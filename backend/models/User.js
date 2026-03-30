const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sipExtension: { type: String, required: true }, // e.g., '101'
    role: { type: String, enum: ['admin', 'associate'], default: 'associate' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
