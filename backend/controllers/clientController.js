const Client = require('../models/Client');
const CallLog = require('../models/CallLog');

exports.getClients = async (req, res) => {
    try {
        let query = {};
        const { view } = req.query;

        // If not admin, always filter by assignedTo
        // If admin but view is 'mine', also filter by assignedTo
        if (req.user.role !== 'admin' || view === 'mine') {
            query.assignedTo = req.user._id;
        }
        
        const clients = await Client.find(query);
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createClient = async (req, res) => {
    try {
        const client = new Client({ ...req.body, assignedTo: req.user._id });
        const createdClient = await client.save();
        res.status(201).json(createdClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (client) {
            // Ownership check
            if (client.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this client' });
            }

            Object.assign(client, req.body);
            const updatedClient = await client.save();
            res.json(updatedClient);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        // Ownership check
        if (client.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this client detail' });
        }

        const logs = await CallLog.find({ client: client._id }).populate('user', 'name').sort({ createdAt: -1 });
        res.json({ client, logs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (client) {
            // Ownership check
            if (client.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this client' });
            }

            await Client.deleteOne({ _id: req.params.id });
            res.json({ message: 'Client removed' });
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
