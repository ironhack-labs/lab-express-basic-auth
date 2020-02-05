const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt");


router.get("/signup", (req, res) => {
  res.render("auth/signup", {
    js: ["signup"]
  });
});

router.post("/signup", (req, res, next) => {
  const user = req.body; // req.body contains the submited informations (out of post request)

  // if (req.file) user.avatar = req.file.secure_url;

  if (!user.username || !user.password) {
    res.redirect("/auth/signup");
    return;
  } else {


    userModel
      .findOne({
        username: user.username
      })
      .then(dbRes => {
        if (dbRes) return res.redirect("/auth/signup"); //

        const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
        user.password = hashed; // new user is ready for db

        userModel
          .create(user)
          .then(() => res.redirect("/auth/signin"))
        // .catch(dbErr => console.log(dbErr));
      })
      .catch(next);
  }
});

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    // one or more field is missing
    console.log("1")
    return res.redirect("/auth/signin");
  }

  userModel
    .findOne({
      username: user.username
    })
    .then(dbRes => {
      if (!dbRes) {
        console.log("2")
        // no user found with this email
        return res.redirect("/auth/signin");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // req.session.currentUser = user;
        // encryption says : password match succes

        const {
          _doc: clone
        } = {
          ...dbRes
        }; // make a clone of db user


        delete clone.password; // remove password from clone
        // // console.log(clone);

        req.session.currentUser = clone; // user is now in session... until session.destroy
        console.log("3")
        return res.redirect("/");


      } else {
        // encrypted password match failed

        console.log("4")
        return res.redirect("/auth/signin");
      }
    })
    .catch(next);
});


module.exports = router;