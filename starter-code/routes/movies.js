'use strict';
const express = require('express');
const router = express.Router();

const Movie = require('../models/movies');

/* GET movies create. */
router.get('/create', (req, res, next) => {
  res.render('movies-create');
});

router.post('/create', (req, res, next) => {
  const { name, year } = req.body;
  const newMovie = new Movie({ name, year });

  newMovie.save()
    .then((movie) => {
      res.redirect('/');
    });
});

/* GET movies ID. */
router.get('/:id', (req, res, next) => {
  const movieId = req.params.id;

  Movie.findById(movieId)
    .then((result) => {
      const data = {
        movies: result
      };
      res.render('movies', data);
    });
});

router.post('/:id/delete', (req, res, next) => {
  const movieId = req.params.id;

  Movie.findByIdAndRemove(movieId)
    .then((result) => {
      res.redirect('/');
    });
});

module.exports = router;
