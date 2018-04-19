'use strict';
const express = require('express');
const router = express.Router();

const Movie = require('../models/movies');

/* GET home page. */
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  Movie.find({})
    .then((result) => {
      const data = {
        movies: result,
        user
      };
      res.render('index', data);
    });
});

module.exports = router;
