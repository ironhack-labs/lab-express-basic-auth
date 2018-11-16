const mongooose = require("mongoose");
const Schema = mongooose.Schema;

const UserSchema = new Schema({
  username:{type:String, required:true, unique:true},
  password:{type:String, required:true}
})

const User = mongooose.model("User", UserSchema);
module.exports = User;