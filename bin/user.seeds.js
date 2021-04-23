const mongoose = require('mongoose');
const Users = require('../models/user.model');
require("../configs/db.config")

const user = [
    { username: 'testuser', email:'testuser@test.com', passwordHash: 'Bazinga' },
  ];


Users.create(user)
    .then(userFromDB => {
        console.log(`created ${userFromDB.length} user`);
        mongoose.connection.close();
})
.catch(err => console.log(`An error occurred while creating user from DB: ${err}`));