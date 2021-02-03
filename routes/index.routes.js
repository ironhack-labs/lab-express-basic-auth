const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get('/register', usersController.register)
router.post('/register', usersController.doRegister)

module.exports = router;