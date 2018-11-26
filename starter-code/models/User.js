const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
  email:{
    type:String,
    unique: true,
  },
  password: String,
  role: {
    type:String,
    enum: ["mastermind", "student"]
  },
},{
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  versionKey: false
})

module.exports = mongoose.model("User", userSchema)