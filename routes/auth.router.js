const express = require('express');
const router = express.Router();
const authRouter = require('../controllers/auth.controller');
const secure = require('../middlewares/secure.mid');

router.get('/index', authRouter.index);
router.get('/register', authRouter.register);
router.post('/register', authRouter.doRegister);

router.get('/login', authRouter.login);
router.post('/login', authRouter.doLogin);

router.get('/private', secure.isAuthenticated, authRouter.private);

module.exports = router;