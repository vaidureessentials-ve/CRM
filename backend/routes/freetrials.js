const express = require('express');
const router = express.Router();
const freeTrialController = require('../controllers/freeTrialController');
const { protect } = require('../middleware/auth');

router.get('/', protect, freeTrialController.getFreeTrials);
router.post('/', protect, freeTrialController.createFreeTrial);
router.put('/:id', protect, freeTrialController.updateFreeTrial);
router.delete('/:id', protect, freeTrialController.deleteFreeTrial);

module.exports = router;
