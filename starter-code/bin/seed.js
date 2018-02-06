const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic-auth');

const User = require('../models/user');

const users = [
  {
    username: 'Tom Cruise',
    password: 1234
  }
];

User.create(users, (err, savedUsers) => {
  if (err) { throw err; }

  savedUsers.forEach(user => {
    console.log(`${user.name} - ${users._id}`);
  });
  mongoose.disconnect();
});
