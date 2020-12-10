const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.post('/login', login);

const {login} = require('../controllers/auth.controllers');

module.exports = router;
