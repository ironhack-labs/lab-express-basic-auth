const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({

  username: {

    type: String,
    required: [true, 'the username is necessaty'],
    trim: true,
    minlength: [3, 'the username must have 3 letters mininum'],
  },


  email: {
    type: String,
    required: [true, 'The email is necessary'],
    trim: true,
    minlength: [3, 'the email must have 3 letters mininum'],
    lowercase: true,
    unique: true
  },


  password: {

    type: String,
    required: [true, 'The password is necessary'],
    trim: true,
    minlength: [3, 'the password must have 3 letters minimum']
  }

}
);

const User = model("User", userSchema);

module.exports = User;
