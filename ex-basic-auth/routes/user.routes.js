const express = require('express');
const router = express.Router();
const controllerRoutes = require('../controllers/controller.users');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/create', authMiddleware.notAuth, controllerRoutes.create);
router.post('/create', authMiddleware.auth, controllerRoutes.doCreate);

module.exports = router; 

