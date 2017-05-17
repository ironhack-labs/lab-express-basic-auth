/*jshint esversion:6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchemaUser = new Schema({
  username: { type: String, required: true },
  hash: { type: String, required: true }
});

module.exports = mongoose.model('User', SchemaUser);
