const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // TODO: write the schema
  username: { type: String, unique: true},
  password: { type: String }
},
{ timestamps: true }
);

const Users = mongoose.model('Users', userSchema);
module.exports = Users;


