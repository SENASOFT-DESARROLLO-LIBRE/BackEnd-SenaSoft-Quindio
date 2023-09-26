const express = require('express');
const router = express.Router();
const { registerUser, login} = require('../Controllers/userControllers');
// const { protect } = require('../Middleware/authMiddleware');

router.post('/registerUser', registerUser);
router.post('/login', login);

module.exports = router;