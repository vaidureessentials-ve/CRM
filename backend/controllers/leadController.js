const Lead = require('../models/Lead');
const Client = require('../models/Client');

exports.getLeads = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.assignedTo = req.user._id;
        }
        const leads = await Lead.find(query).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createLead = async (req, res) => {
    try {
        const lead = new Lead({ ...req.body, assignedTo: req.user._id });
        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (lead) {
            // Ownership check
            if (lead.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this lead' });
            }

            Object.assign(lead, req.body);
            const updatedLead = await lead.save();
            res.json(updatedLead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.convertLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        // Ownership check
        if (lead.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to convert this lead' });
        }

        // Create a Client from Lead
        const client = new Client({
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            company: lead.company,
            assignedTo: lead.assignedTo,
            status: 'Active'
        });
        await client.save();

        // Mark Lead as Converted
        lead.status = 'Converted';
        await lead.save();

        res.json({ message: 'Lead converted to client successfully', client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (lead) {
            // Ownership check
            if (lead.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this lead' });
            }

            await lead.deleteOne();
            res.json({ message: 'Lead removed' });
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
