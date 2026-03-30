const mongoose = require('mongoose');

const SalesOrderSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Cancelled'], default: 'Pending' },
    items: [{ name: String, price: Number, quantity: Number }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);
