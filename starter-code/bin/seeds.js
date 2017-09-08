const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic-auth');
const SignUp = require('../models/signup')

const userData = [
  { username: 'Phil', password: 123},
  { username: 'Frances', password: 123},
];

SignUp.create(userData, (err, docs) => {
  if (err) {
    throw err;
  }

  docs.forEach((data) => {
    console.log(data.username);
  });
  mongoose.connection.close();
});
