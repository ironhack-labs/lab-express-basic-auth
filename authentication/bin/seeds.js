const users = [{
    username: 'cat',
    password: null
  },{
    username: 'dog',
    password: null
  },{
    username: 'elephant',
    password: null
}];

const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect('mongodb://localhost/usersApp')
.then(() => {
  console.log('Connected to Mongo!');

  User.insertMany(users)
  .then(res => {
    console.log('Los datos se han introducido correctamente.', res);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Se ha producido un error', err)
    mongoose.connection.close();
  });

})
.catch(err => {
  console.error('Error connecting to mongo', err);
});