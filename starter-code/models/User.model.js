const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = mongoose.model("User", new Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true}
}));

module.exports = UserModel;
