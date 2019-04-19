const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid')
const user = require('../controllers/user.controller');

router.get('/users', secure, user.sessionCreated);
router.get('/users/main', secure, user.main);
router.get('/users/private', secure, user.private);



module.exports = router;
