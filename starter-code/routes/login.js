const express = require("express");
const router = express.Router();
const UserMOdel = require("./../model/user");
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("project_folder/login");
});

router.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.render("project_folder/login", {
      errorMsg: "fill in a username and password"
    });
    return;
  }
  // when we get here it means that there is a username and password provided
  UserMOdel.findOne({ username: username })
    .then(foundUser => {
      console.log("user ", foundUser, " was found");
      if (!foundUser) {
        res.render("project_folder/login", {
          errorMsg: "an incorrect username and or password was provided"
        });
        return;
      }
      // check if the provided password is correct
      if (bcrypt.compareSync(password, foundUser.password)) {
        // create a session
        req.session.currentUser = username;
        res.redirect("/private");
        return;
      } else {
        res.render("project_folder/login", {
          errorMsg: "an incorrect username and or password was provided"
        });
        return;
      }
    })
    .catch(dbErr => {
      console.log("error while searching for user", dbErr);
      res.render("project_folder/login", {
        errorMsg: "an incorrect username and or password was provided"
      });
    });
});

module.exports = router;
