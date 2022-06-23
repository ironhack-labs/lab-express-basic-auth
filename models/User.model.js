const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    minLength:3 
  },
  password: {
    type:String,
  require:[true,"You have to add a password"], 
  },
  email:{
    type:String,
    require:[true,"You have to add your email"], 
    unique: true
  }, 
  profile_pic: {
    type:String,
    default:"https://pbs.twimg.com/profile_images/1568439274/Foto_G__400x400.jpg"
  },
  },
  {
    timestamps: true,
  }
  );

const User = model("User", userSchema);

module.exports = User;
