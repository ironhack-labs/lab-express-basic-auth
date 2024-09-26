const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/profile', authMiddleware.isAuthenticated, userController.profile);

module.exports = router;