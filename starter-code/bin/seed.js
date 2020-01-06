const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');

mongoose
  .connect('mongodb://localhost/basic-auth', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const plainPassword1 = 'dravenjungle';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(plainPassword1, salt);

const username: 'japa2';

User.create({username, password: hash})
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    throw new Error(error);
  });
