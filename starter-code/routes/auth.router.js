const express = require('express');
const router = express.Router();
const authRouter = require('../controllers/auth.controller')

router.get('/register', authRouter.register);
router.post('/register', authRouter.doregister);