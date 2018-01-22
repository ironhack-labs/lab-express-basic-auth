const express = require('express');
const router = express.Router();
const security = require('../configs/security.config');
const userController = require('../controllers/user.controller');

router.get('/main', security.isAuthenticated, userController.public);
router.get('/private', security.isAuthenticated, userController.profile);

module.exports = router;