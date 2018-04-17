'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const quoteSchema = new Schema({
  name: {
    type: String
  },
  batch: {
    type: String
  },
  quote: {
    type: String
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
