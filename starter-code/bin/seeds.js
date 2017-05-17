const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/starter-code');



const User = require('../models/user');

const users = [
  {
    userName: 'miguelpastor',
    password: "1234"
  },

  {
    userName: 'nicholasrodman',
    password: "1234"
  }

];


User.create(users, (err, docs) => {
  if (err) { throw err };

  docs.forEach( (user) => {
    console.log(user.userName)
  });
  mongoose.connection.close();
});
