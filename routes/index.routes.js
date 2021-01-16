const express = require('express');
const router = express.Router();
const userController = require ('../controllers/user.controller');
const commonController = require('../controllers/common.controller');

/* GET home page */
router.get('/', commonController.home);
router.get('/register', userController.register); 
router.post('/register', userController.doRegister);


module.exports = router;
