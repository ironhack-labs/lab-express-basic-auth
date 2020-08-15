const mongoose = require('mongoose');

const User = require('../models/User.model');

require('../configs/db.config');

const fakeUsers = [
    {
      username: 'amartin07',
      password: '12345'

    },
    {
      username: 'luca85',
      password: '12345'
    },
    {
      username: 'madmax',
      password: '12345'
    }
  ];
  
  User.create(fakeUsers)
    .then(dbUsers => {
      console.log(`Created ${dbUsers.length} users`);
      mongoose.connection.close();
    })
    .catch(err =>
      console.log(`An error occurred while creating fake users in the DB: ${err}`)
    );