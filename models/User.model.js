const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  //username
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
    },
    //email
      email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true
    },
      password: {
      type: String,
      required: [true, "Password is required."]
    }
},
  {
    timestamps: true
  }
  );

const User = model("User", userSchema);

module.exports = User;
