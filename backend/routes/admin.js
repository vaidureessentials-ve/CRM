const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const xlsx = require('xlsx');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to ensure admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// @route   GET api/admin/logs
// @desc    Get recent activity logs
router.get('/logs', protect, adminOnly, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/admin/stats
// @desc    Get system wide stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'associate' });
    const totalLeads = await Lead.countDocuments();
    const recentLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(5);
    
    res.json({
      totalUsers,
      totalLeads,
      recentLogs,
      systemStatus: 'Optimal',
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/admin/import-leads
// @desc    Import leads from excel file
router.post('/import-leads', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an excel file' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'The uploaded file is empty' });
    }

    const leads = data.map(row => ({
      name: row.Name || row.name || row.NAME,
      phone: row.Phone || row.phone || row.PHONE || row.Mobile || row.mobile,
      email: row.Email || row.email || row.EMAIL,
      company: row.Company || row.company || row.COMPANY,
      source: row.Source || row.source || row.SOURCE || 'Excel Import',
      segment: row.Segment || row.segment || row.SEGMENT || 'Fresh Pool',
      notes: row.Notes || row.notes || row.NOTES,
      assignedTo: req.user._id
    })).filter(lead => lead.name && lead.phone);

    if (leads.length === 0) {
      return res.status(400).json({ message: 'No valid lead data found (Name and Phone are required)' });
    }

    await Lead.insertMany(leads);

    res.status(201).json({ message: `${leads.length} leads imported successfully` });
  } catch (err) {
    console.error('Lead import error:', err);
    res.status(500).json({ message: 'Failed to import leads. Please check your file format.' });
  }
});

module.exports = router;
