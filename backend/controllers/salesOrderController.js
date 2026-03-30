const SalesOrder = require('../models/SalesOrder');

exports.getSalesOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.createdBy = req.user._id;
        }
        const orders = await SalesOrder.find(query)
            .populate('client', 'name phone email company')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching sales orders:', error);
        res.status(500).json({ message: 'Internal server error fetching sales orders' });
    }
};

exports.createSalesOrder = async (req, res) => {
    try {
        const order = new SalesOrder({ ...req.body, createdBy: req.user._id });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSalesOrder = async (req, res) => {
    try {
        const order = await SalesOrder.findById(req.params.id);
        if (order) {
            // Ownership check
            if (order.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this sales order' });
            }
            
            Object.assign(order, req.body);
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Sales Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSalesOrder = async (req, res) => {
    try {
        const order = await SalesOrder.findById(req.params.id);
        if (order) {
            // Ownership check
            if (order.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this sales order' });
            }
            
            await order.deleteOne();
            res.json({ message: 'Sales Order removed' });
        } else {
            res.status(404).json({ message: 'Sales Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
