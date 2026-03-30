const express = require('express');
const router = express.Router();
const { getCallLogs, createCallLog } = require('../controllers/callController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getCallLogs)
    .post(protect, createCallLog);

module.exports = router;
