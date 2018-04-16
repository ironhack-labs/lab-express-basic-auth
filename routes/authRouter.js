const express = require("express");
const User = require("../models/User")
const router = express.Router();

const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

router.get ("/signup", (req, res)=>{
res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  let { username, password } = req.body;
  
  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "El usuario ya existe"
      });
      return;
    }
    if (username === "" || password ==="") {
      res.render("auth/signup",{
        errorMessage: "Indica un nombre de usuario y contraseña"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      username,
      password: hashPass
    });
    newUser.save(err => {
      res.redirect("/");
    });
  });
});

module.exports = router;
