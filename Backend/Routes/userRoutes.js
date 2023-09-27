const express = require('express');
const router = express.Router();
const { registerUser, login, recoverPassword, confirm, getLocations, saveLocations} = require('../Controllers/userControllers');
const { protect } = require('../Middleware/authMiddleware');

router.post('/registerUser', registerUser);
router.post('/login', protect, login);
router.patch('/recoverPassword', recoverPassword);
router.get('/confirm/:token', confirm);
router.post('/saveLocations', saveLocations);

module.exports = router;