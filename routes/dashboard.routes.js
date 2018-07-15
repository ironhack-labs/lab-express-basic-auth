const express = require('express');
const router = express.Router();
const controllerDashboard = require('../controllers/controller.dashboard');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.auth, controllerDashboard.logged);

module.exports = router;
