const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/salesOrderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, salesOrderController.getSalesOrders);
router.post('/', protect, salesOrderController.createSalesOrder);
router.put('/:id', protect, salesOrderController.updateSalesOrder);
router.delete('/:id', protect, salesOrderController.deleteSalesOrder);

module.exports = router;
