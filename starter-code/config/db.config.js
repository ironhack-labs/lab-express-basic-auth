const mongoose = require('mongoose');

const DB_NAME = 'express-basic-auth';

mongoose
  .connect(`mongodb://localhost/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });
