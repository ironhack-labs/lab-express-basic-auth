// User model here
const { Schema, model}=require("mongoose")

const userSchema=({
  username: {
    type: String,
    trim: true,
    required: [true, "Username is required."],
    unique: true
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required."]
  },
})

module.exports=model("User", userSchema)