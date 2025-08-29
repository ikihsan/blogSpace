const express = require('express');
const { login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
