const express = require('express');
const router  = express.Router();
const loginController = require('../controllers/login.controller')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', loginController.login)
router.post('/', loginController.doLogin)

module.exports = router;
