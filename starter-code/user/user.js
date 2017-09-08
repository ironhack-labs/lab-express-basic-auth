//we use moongo for not create all the class and store information, but we do that with mongoose

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema ({
	username       : {type: String,required:"Username needed"},
    password       : {type: String,required:"Password needed"},
  
});

const user = mongoose.model('User', userSchema);

module.exports = user;

//user
