const mongoose = require('mongoose');

require('../config/db.config');

const user = require('../models/user.model');

const users = [
  {
    username: 'Mario',
    password: '1234',
  }
];

user.create(users).then((docs) => {
  docs.forEach((user) => {
    console.log(user.username)
  });

  mongoose.connection.close();
});