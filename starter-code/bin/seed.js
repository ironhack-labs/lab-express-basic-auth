const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

mongoose
  .connect('mongodb://localhost/starter-code', { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`,
    );
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

bcrypt
  .hash('12345', 10)
  .then((password) => {
    const users = [
      { username: 'admin', password: password },
      { username: 'JonathanSaudhof', password: password },
    ];
    return User.create(users);
  })
  .then((result) => {
    console.log(result);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
