const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, convertLead, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getLeads)
    .post(protect, createLead);

router.route('/:id')
    .put(protect, updateLead)
    .delete(protect, deleteLead);

router.post('/:id/convert', protect, convertLead);

module.exports = router;
