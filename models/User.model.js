const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
},{
  //this obj adds extra properties: creartAt and updateAt
  timestamps: true,
});

const User = model("User", userSchema);

module.exports = User;
