const CallLog = require('../models/CallLog');

exports.getCallLogs = async (req, res) => {
    try {
        let query = {};
        const { view } = req.query;

        if (req.user.role !== 'admin' || view === 'mine') {
            query.user = req.user._id;
        }

        const logs = await CallLog.find(query).populate('client', 'name phone').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCallLog = async (req, res) => {
    try {
        const { client, duration, status, notes } = req.body;
        const log = new CallLog({
            client,
            user: req.user._id,
            duration,
            status,
            notes
        });
        const createdLog = await log.save();
        res.status(201).json(createdLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
