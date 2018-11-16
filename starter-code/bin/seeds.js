const mongoose = require('mongoose');
const User = require('../model/user');



mongoose
.connect('mongodb://localhost/usersDB', {useNewUrlParser: true})
.then(x => {
  console.log(`Connected to Mongo!`)
})
.catch(err => {
  console.error('Error connecting to mongo', err)
});

const users = [

{
  user : 'admin',
  password: 'password'
}

];

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(users.length);
  mongoose.connection.close()
});