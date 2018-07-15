const express = require('express');
const router = express.Router();
const controllerSessions = require('../controllers/controller.sessions');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/create', authMiddleware.notAuth, controllerSessions.create);
router.post('/create', authMiddleware.notAuth, controllerSessions.doCreate);
router.post('/delete', authMiddleware.auth, controllerSessions.doDelete);

module.exports = router;
