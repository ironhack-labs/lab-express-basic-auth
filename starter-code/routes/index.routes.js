const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller');

router.get('/', indexController.index);

module.exports = router;