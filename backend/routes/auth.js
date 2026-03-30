const express = require('express');
const router = express.Router();
const { registerUser, authUser, getMe, getAssociates, deleteUser, updateUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

router.post('/register', protect, adminOnly, registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);
router.get('/associates', protect, getAssociates);
router.route('/:id').delete(protect, deleteUser).put(protect, updateUser);

module.exports = router;
