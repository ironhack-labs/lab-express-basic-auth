const express = require('express');
const router = express.Router();
const security = require('../config/security.config');
const userController = require('../controllers/user.controller');

router.get('/main', security.isAuthenticated, userController.main);
router.get('/private', security.isAuthenticated, userController.private);

module.exports = router;