const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;

const userSchema= new Schema({
  username : String,
  password : String
},{
  timestamps: {
    createdAd:"created_at",
    updatedAD:"updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
