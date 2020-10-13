const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("my req.body is: ", req.body);

  if (!username || !password) {
    res
      .status(500)
      .render("auth/signup.hbs", { message: "Please enter a valid input!" });
    return;
  }

  let passwordReg = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
  );
  if (!passwordReg.test(password)) {
    res.status(500).render("auth/signup.hbs", {
      message:
        "Password must have one lowercase, one uppercase, a number, a special character and must be atleast 8 digits long",
    });
    return; // add return to not implement the data in the DB if there is an error
  }

  if (username.length < 4) {
    res.status(500).render("auth/signup.hbs", {
      message: "Username has to be at least 4 characters!",
    });
    return;
  }

  bcrypt.genSalt(12).then((salt) => {
    bcrypt.hash(password, salt).then((hashedPassword) => {
      UserModel.create({
        username,
        password: hashedPassword,
      }).then(() => {
        res.redirect("/");
      });
    });
  });
});

router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  //post is about sending data to the server

  UserModel.findOne({ username: username })
    .then((data) => {
      if (!data) {
        res
          .status(500)
          .render("auth/login.hbs", { message: "Username not found." });
        return;
      }
      bcrypt
        .compare(password, data.password)
        .then((result) => {
          //result will be T or F. And we need to store that return Value in a variable and do something sith depending on the result
          if (result) {
            req.session.currentUser = data;
            // console.log("my data is:", data)
            // console.log("my reqsesscurr is:", req.session.currentUser)  //we want to store something extra to the session - the current user
            res.redirect("/main");
          } else {
            res
              .status(500)
              .render("auth/login.hbs", {
                message: "Password is not matching",
              }); //diffined your message in signin.hbs
          }
        })
        .catch(() => {
          res
            .status(500)
            .render("auth/login.hbs", { message: "Something went wrong" });
        });
    })
    .catch(() => {
      res
        .status(500)
        .render("auth/login.hbs", { message: "Something went wrong" });
    });
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    // if there's user in the session (user is logged in)
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res) => {
  res.render("auth/main.hbs", { username: req.session.currentUser.username });
});

router.get("/private", (req, res) => {
  res.render("auth/private.hbs", {
    username: req.session.currentUser.username,
  });
});

module.exports = router;
