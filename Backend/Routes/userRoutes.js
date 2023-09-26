const express = require('express');
const router = express.Router();
const { registerUser, login, confirm} = require('../Controllers/userControllers');

router.post('/registerUser', registerUser);
router.post('/login', login);
router.get('/confirm/:token', confirm);

module.exports = router;