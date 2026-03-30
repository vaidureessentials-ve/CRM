const FreeTrial = require('../models/FreeTrial');

exports.getFreeTrials = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.assignedTo = req.user._id;
        }
        const trials = await FreeTrial.find(query)
            .populate('lead', 'name phone email company')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });
        res.json(trials);
    } catch (error) {
        console.error('Error fetching free trials:', error);
        res.status(500).json({ message: 'Internal server error fetching free trials' });
    }
};

exports.createFreeTrial = async (req, res) => {
    try {
        const trial = new FreeTrial({ ...req.body, assignedTo: req.user._id });
        const createdTrial = await trial.save();
        res.status(201).json(createdTrial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateFreeTrial = async (req, res) => {
    try {
        const trial = await FreeTrial.findById(req.params.id);
        if (trial) {
            // Ownership check
            if (trial.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this free trial' });
            }

            Object.assign(trial, req.body);
            const updatedTrial = await trial.save();
            res.json(updatedTrial);
        } else {
            res.status(404).json({ message: 'Free Trial not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFreeTrial = async (req, res) => {
    try {
        const trial = await FreeTrial.findById(req.params.id);
        if (trial) {
            // Ownership check
            if (trial.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this free trial' });
            }

            await trial.deleteOne();
            res.json({ message: 'Free Trial removed' });
        } else {
            res.status(404).json({ message: 'Free Trial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
