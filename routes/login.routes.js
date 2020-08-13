const { Router } = require("express");
const router = new Router();
const bycrypt = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const mongoose = require("mongoose");

//////////////////////////
/* GET user login  page */
router.get("/", (req, res) => {
  console.log(" entered for login ");
  res.render("user-login");
  //   console.log(req.session.userInformation);
  //   res.render("user-login", { userDetails: req.session.userInformation });
});

router.post("/", (req, res, next) => {
  //   console.log(" entered for post login ");
  //   console.log(req.session);
  //   console.log(req.body);
  const { usrName: username, usrPassword: password } = req.body;

  if (username === "" || password === "") {
    res.render("user-login", {
      errorMessage: "Please enter both username and password to login.",
    });
    return;
  }
  //   console.log(username);

  User.findOne({ username })
    .then((userFromDB) => {
      //   console.log(userFromDB);
      console.log(password, userFromDB.password);
      if (!userFromDB) {
        res.render("user-login", {
          errorMessage: "User is not registered.",
        });
        return;
      } else if (bycrypt.compareSync(password, userFromDB.password)) {
        // console.log(" login success");

        // the following line gets replaced with what follows:
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = userFromDB;
        res.redirect("/userProfile");
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("user-login", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("user-login", {
          errorMessage:
            "Username  need to be unique. username is already used.",
        });
      } else {
        next(error);
      }
    }); // close .catch()
});

module.exports = router;
