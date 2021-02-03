const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get('/register', userController.registerForm)
router.post('/register', userController.register)

module.exports = router;
