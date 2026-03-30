const FollowUp = require('../models/FollowUp');

exports.getFollowUps = async (req, res) => {
    try {
        let query = { user: req.user._id };
        if (req.user.role === 'admin' && req.query.view === 'all') {
            query = {};
        }
        const followUps = await FollowUp.find(query).sort({ followUpDate: 1 });
        res.json(followUps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createFollowUp = async (req, res) => {
    try {
        const followUp = new FollowUp({ ...req.body, user: req.user._id });
        const created = await followUp.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateFollowUp = async (req, res) => {
    try {
        const followUp = await FollowUp.findById(req.params.id);
        if (!followUp) return res.status(404).json({ message: 'Follow-up not found' });

        // Ownership check
        if (followUp.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this follow-up' });
        }

        Object.assign(followUp, req.body);
        const updated = await followUp.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFollowUp = async (req, res) => {
    try {
        const followUp = await FollowUp.findById(req.params.id);
        if (!followUp) return res.status(404).json({ message: 'Follow-up not found' });

        // Ownership check
        if (followUp.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this follow-up' });
        }

        await followUp.deleteOne();
        res.json({ message: 'Follow-up removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
