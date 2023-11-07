const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true

  },
  password: String
})

const User = model("User", userSchema);
const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('../middleware/routh-guard')

router.get("/perfil", isLoggedIn, (req, res) => {
  res.render("user/profile", { user: req.session.currentUser })
})

module.exports = router

module.exports = User;
