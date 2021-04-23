const mongoose = require("../configs/db.config");
const User = require("../models/User.model");


const users = [
  { username: 'test1', password: 'test1'},
  { username: 'test2', password: 'test2'},
];



User
  .create(users)
  .then(usersFromDB => {
    console.log(`Created ${usersFromDB.length} users`);

    mongoose.connection.close();
  })
  .catch((err) => console.log(`An error occurred while creating users from the DB: ${err}`));
