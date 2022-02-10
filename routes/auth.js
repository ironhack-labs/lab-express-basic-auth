const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { redirect } = require("express/lib/response");
const { model } = require("mongoose");
const User = require("../models/User.model");
const res = require("express/lib/response");
const saltRounds = 10;


////////////REGISTER USER////////////
router.get("/register", (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", (req, res, next) => {
  
  const { password, username } = req.body;
  
  if (!password || !username) {
    res.render("auth/register", {
      errorMessage:
        "All fields are mandatory. Please provide username and password.",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      const userDetails = {
        username: username,
        password: hash,
      };
      console.log("this is username and hash", username, hash)
      return User.create(userDetails);
    })
    .then((userFromDb) => {
      console.log("User created ", userFromDb);
      res, redirect("/");
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/register", { errorMessage: err.message });
      }
    });
});

//////////USER LOGIN////////////////
router.get("/login", (req, res, next) => {res.render("auth/login")});

router.post("/login",(req, res, next)=>{
    const {username, password} = req.body;

    if (!username || !password) {
        res.send("Please enter both, username and password to login.");
        return;
      }

      User
        .findOne({username:username})
        .then((userFromDb) => {
            if(!userFromDb) {
                res.send("Username is not registered. Try another username.");
            return;
             } else if (bcrypt.compareSync(password, userFromDb.password)) {
            res.redirect("/user-profile");
            } else {
            res.render("auth/login", {errorMessage: "Incorrect credentials."});
            }    
        })
        .catch(err => console.log("Error getting user details from database", err)); 
})

router.get("/user-profile", (req, res) => {
    res.render("users/user-profile");
});


module.exports = router;
