'use strict';
const express = require('express');
const router = express.Router();

const Movie = require('../models/movies');

/* GET movies create. */
router.get('/create', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('movies-create');
    return;
  }
  res.redirect('/');
});

router.post('/create', (req, res, next) => {
  if (req.session.currentUser) {
    const { name, year } = req.body;
    const newMovie = new Movie({ name, year });

    newMovie.save()
      .then((movie) => {
        res.redirect('/');
      })
      .catch(next);
    return;
  }
  res.redirect('/');
});

/* GET movies ID. */
router.get('/:id', (req, res, next) => {
  const movieId = req.params.id;
  const user = req.session.currentUser;

  Movie.findById(movieId)
    .then((result) => {
      const data = {
        movies: result,
        user
      };
      res.render('movies', data);
    })
    .catch(next);
});

router.post('/:id/delete', (req, res, next) => {
  if (req.session.currentUser) {
    const movieId = req.params.id;

    Movie.findByIdAndRemove(movieId)
      .then((result) => {
        res.redirect('/');
      })
      .catch(next);
    return;
  }
  res.redirect('/');
});

module.exports = router;
