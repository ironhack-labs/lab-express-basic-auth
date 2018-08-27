const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");

//Step 1 = Connect to DB using mongoose

mongoose.Promise = Promise;
mongoose
  .connect(
    "mongodb://localhost/authorization-exercise",
    { useMongoClient: true }
  )
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

//Step 2 = actually create the model i.e. use Model.create()

let newusersArray = [
  {
    username: "isabella",
    password: "incorrect"
  },
  {
    username: "blackm@gic",
    password: "notcorrect"
  },
  {
    username: "runningoutofIdeas",
    password: "metoo"
  }
];

UserModel.create(newusersArray)
  .then(newModel => {
    console.log(newModel, newModel.length, "users were created");
  })
  .catch(err => {
    console.log("sorry users were not created");
  });
