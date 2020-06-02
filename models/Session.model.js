// Session model here
const { Schema, model } = require('mongoose');

const sessionSchema = new Schema(
  {
    expires: Date,
    session: String
  }
);

 module.exports = model('Session', sessionSchema);