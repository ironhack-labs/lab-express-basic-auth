const { Schema, model } = require('mongoose');
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

    pictureUrl: {
      type: String,
      default: "https://shamelesstale.files.wordpress.com/2016/03/cat-sneeze14.jpg",
   },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
