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
  let username = req.body.username;
  let password = req.body.password;
  let salt     = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    alert("userdata is required");
  } else {
    User.findOne({username}, "username", (error, user) => {
      if (error) {
        throw error;
      } else if(user !== null) {
        alert("please select a different username");
      } else {
        let newUser = User({
          username,
          password: hashPass
        });
        newUser.save((error) => {
          res.redirect("/welcome");
        });
      }
    }
  );
  }
});


module.exports = router;
