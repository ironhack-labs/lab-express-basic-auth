const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      
  },
  img: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: String
});

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }

const User = model("User", userSchema);

module.exports = User;