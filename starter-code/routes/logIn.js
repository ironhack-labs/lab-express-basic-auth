const express = require("express");
const router = express.Router();

const User = require("../user/user.js");

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


//GET logIn Page
router.get("/logIn", function(req, res, next){
  res.render("logIn");
});

router.post("/logIn", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let salt     = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    console.log("please provide a username and password");
  } else {
    User.findOne({username}, "username password", (error, user) => {
      if (error) {
        throw error;
      } else if(user.username === username && user.password === hashPass) {
        res.render("welcome");
      } else {
        console.log("username", username);
        console.log("password", user.password);
        console.log("user.username", user.username);
        console.log("user.password", hashPass);

        console.log("wrong userdata");
        res.render("logIn");

      }
    }
  );
  }
});


module.exports = router;
