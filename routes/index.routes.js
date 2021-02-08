
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const miscController = require('../controllers/misc.controller')
/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get('/register', userController.register)
router.post('/register', userController.doRegister)
router.get('/', miscController.home)
// Users
module.exports = router;