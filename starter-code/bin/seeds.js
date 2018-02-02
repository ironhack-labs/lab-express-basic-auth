const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/userdb");
const User = require("../models/user");

const users = [
  {
    username: "eduardo",
    password: "aaa"
  }
];

User.create(users, (err, docs) => {
  if (err) {
    next(err);
  }
  docs.forEach(user => {
    console.log(user.username);
  });
  mongoose.connection.close();
});
