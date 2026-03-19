const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { registerUser } = require('../controllers/authController');

router.post('/register', verifyToken, registerUser);

module.exports = router;
