const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users.controller')

//Iteration 1

router.get('/register', userControllers.edit)
router.post('/register',userControllers.doEdit)

//Iteration 2

router.get('/login',userControllers.login);
router.post('/login',userControllers.doLogin);

module.exports = router;