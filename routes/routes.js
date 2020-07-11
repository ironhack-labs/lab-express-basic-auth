const express = require('express');
const router = express.Router();
const userControler = require('../controllers/user.controller');

router.get('/', (req, res, next) => res.render('index'));

router.get('/users/signup', userControler.signup);

router.post('/users/create-user', userControler.createUser);

router.get('/users/login', userControler.login);

module.exports = router;