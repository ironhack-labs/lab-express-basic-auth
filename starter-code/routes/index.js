const express = require("express");
const router = express.Router();
const userModel = require("./../models/user");
const bcrypt = require("bcrypt");
// const createUser = require("./../views/create-user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/user", (req, res) => {
  res.render("user");
});

//signin

router.post("/create-user", (req, res, next) => {
  const user = req.body; // req.body contains the submited informations (out of post request)

  if (!user.username || !user.password) {
    res.render("index", { message: "Fill all the fields" });
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) {
          res.redirect("/user");
          return;
        }
        console.log("here ...");
        const salt = bcrypt.genSaltSync(10); // cryptography librairie
        const hashed = bcrypt.hashSync(user.password, salt);
        console.log("original", user.password);
        user.password = hashed;
        console.log("hashed", hashed);
        // return ;
        userModel
          .create(user)
          .then(() => res.redirect("/user"))
          .catch(dbErr => console.log(dbErr));
      })
      .catch(dbErr => {
        next(dbErr);
      });
  }
});

//signup
router.post("/login", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.render("index", { message: "Fill all the fields" });
  }
  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        res.render("index", { message: "Bad Password or username" });
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        console.log("good pass", dbRes);
        req.session.currentUser = dbRes;
        return res.redirect("/user");
      } else {
        console.log("bad pass");
        res.render("index", { message: "Bad Password or username" });
      }
    })
    .catch(dbErr => {
      next(dbErr);
    });
});

module.exports = router;
