const express = require('express');
const router = express.Router();
const authRouter = require('../controllers/auth.controller');
// const secure = require('../middlewares/secure.mid');

router.get('/register', authRouter.register);
router.post('/register', authRouter.doRegister);

router.get("/login", authRouter.login);
router.post("/login", authRouter.doLogin);

router.get("/profile", authRouter.profile);

module.exports = router;


