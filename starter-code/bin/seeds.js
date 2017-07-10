const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/basic-auth");

const User = require("../models/user");


const userData = [
  { username: "Sara", password: "Ironhack12" }
];

User.create(userData, (err, info) => {
  if(err) {
    throw err;
  }
  info.forEach((user) => {
    console.log(user.username);
  });
  mongoose.connection.close();
});
