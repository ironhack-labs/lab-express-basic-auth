const mongoose = require("mongoose");
const Schema = mongoose.Schema;

<<<<<<< HEAD
const userData = new Schema({
  username: String,
  password: String
});

const UserModel = mongoose.model("Users", userData);

module.exports = UserModel;
=======
const schemaName = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true
  }
);

const Model = mongoose.model("Users", schemaName);
module.exports = Model;
>>>>>>> 3425e0f6e987f6d7bdc8515d5ec1c9a2ee865d18
