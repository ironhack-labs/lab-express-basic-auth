const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.connect('mongodb://localhost/lab-basic-auth', {useMongoClient: true});

const user = new User({
  username: 'Thibaut',
  password: '1234'
});

user.save();

mongoose.connection.close();
