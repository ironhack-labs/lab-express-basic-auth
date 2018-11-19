const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user : {type:String, required:true, unique:true},
  password: {type:String, required:true}
});

const  User = mongoose.model('user', UserSchema);
module.exports = User;