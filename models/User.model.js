const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {type: String,
  required: true
  },
  image:{
    type:String,
    default:"https://media.giphy.com/media/1431E7VsLJxfqg/giphy.gif"
  },
}, {timestamps: true});

const User = model("User", userSchema);

module.exports = User;

