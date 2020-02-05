const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcryptjs");

// Routes

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", {}); // render
});

router.get("/signin", (req, res, next) => {
  res.render("auth/signin", { error: req.query.err }); // render
});
// router.get("/secret", (req, res, next) => {
//   res.render("secret"); // render
// });

// action::Registering

// router.post("/signup", uploader.single("avatar"), (req, res, next) => {
router.post("/signup", (req, res, next) => {
  const user = req.body; // req.body contains the submited informations (out of post request)
  // if (req.file) user.avatar = req.file.secure_url;
  if (!user.username || !user.password) {
    return res.send("Next time you will complete this form !");
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes)
          return res.render("auth/signup", {
            error: "No way you already have a login"
          }); //,
        const salt = bcrypt.genSaltSync(5); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
        // console.log(user.password)
        user.password = hashed; // new user is ready for db

        userModel.create(user).then(() => res.redirect("/auth/signin"));
        // .catch(dbErr => console.log(dbErr));
      })
      .catch(next);
  }
});

router.post("/signin", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    return res.redirect("/auth/signin");
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (!dbRes || !bcrypt.compareSync(user.password, dbRes.password))
          return res.redirect("/auth/signin");
        if (bcrypt.compareSync(user.password, dbRes.password)) {
          const cloneUser = { ...dbRes };
          cloneUser.password = "";
          req.session.currentUser = cloneUser;
          return res.redirect("/auth/secret");
        }
      })
      .catch(next);
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/signin");
  });
});

module.exports = router;
