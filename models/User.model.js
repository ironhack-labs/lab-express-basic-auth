const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  name: {
    type : String,
    required : true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
      type: String,
      required: true,
  } 
},
{
  timestamps: true
})

module.exports = model("User", userSchema)


