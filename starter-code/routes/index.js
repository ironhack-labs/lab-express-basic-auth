const express = require("express");
const router = express.Router();

const User = require("../user/user.js");

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


//GET home page.
router.get("/", function(req, res, next){
  res.render("index");
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  let salt     = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    console.log("userdata is required");
  } else {
    User.findOne({username}, "username", (error, user) => {
      if (error) {
        throw error;
      } else if(user !== null) {
        console.log("please select a different username");
      } else {
        let newUser = User({
          username,
          password: hashPass
        });
        newUser.save((error) => {
          console.log("password", hashPass);
          res.redirect("welcome");
        });
      }
    }
  );
  }
});


module.exports = router;
