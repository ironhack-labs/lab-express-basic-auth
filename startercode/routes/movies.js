'use strict';

// -- require npm packages
var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

// -- require your own modules (router, models)

const Movie = require('../models/movie');

// -- routes

router.get('/create', (req, res, next) => {
  res.render('create-movie');
});

router.post('/add', (req, res, next) => {
  const movie = new Movie(req.body);
  movie.save()
    .then(() => {
      res.redirect('/');
    });
});

router.post('/:id/delete', (req, res, next) => {
  // const movie = new Movie(req.body);
  const movieId = req.params.id;
  // Movie.findByIdAndRemove('5ad0b8bbf28b93426df1fa34')
  Movie.findByIdAndRemove(movieId)
    .then(() => {
      res.redirect('/');
    });
});

router.get('/:id', (req, res, next) => {
  const movieId = req.params.id;
  // validate mongo id and send 404 if invalid
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    res.status(404);
    res.render('not-found');
    return;
  }
  Movie.findById(movieId)
    .then((result) => {
      if (!result) {
        res.status(404);
        res.render('not-found');
        return;
      }
      const data = {
        movies: result
      };
      res.render('movie', data);
    })
    // catch all errors, send them to the global error handler
    .catch(next);
});

module.exports = router;
