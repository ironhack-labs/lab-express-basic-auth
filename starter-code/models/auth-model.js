//SETUP
//-----------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Schema 
//-----------------

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  encryptedUserPass: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
})



//Export
//-----------------
const User = mongoose.model("User", userSchema);
module.exports = User;