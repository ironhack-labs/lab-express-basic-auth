const mongoose = require('mongoose');

const mongoUrl = 'mongodb://localhost/express-basic-auth-dev'

mongoose
  .connect(mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

module.exports = { mongoose, mongoUrl };