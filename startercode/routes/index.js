'use strict';

// -- require npm packages
const express = require('express');
const router = express.Router();

// -- require your own modules (router, models)
// const User = require('../models/user');

/* GET home page. */

router.get('/', (req, res, next) => {
  const username = req.app.locals.username;
  const data = {
    username: username
  };
  res.render('index', data);
});

module.exports = router;
