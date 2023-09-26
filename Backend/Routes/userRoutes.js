const express = require('express');
const router = express.Router();
const { registerUser, login, confirm} = require('../Controllers/userControllers');
const { protect } = require('../Middleware/authMiddleware');

router.post('/registerUser', registerUser);
router.post('/login', protect, login);
router.get('/confirm/:token', confirm);

module.exports = router;