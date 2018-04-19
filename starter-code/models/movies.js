'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: {
    type: String
  },
  year: {
    type: Number
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
