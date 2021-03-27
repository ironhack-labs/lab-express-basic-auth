const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (request, response, next) => {
  response.render("auth/signup");
});

router.post("/signup", (request, response, next) => {
  const { userName, password } = request.body;
  if (userName === "" || password === "")
    response.render("auth/signup", {
      errorMessage: "Name and Password required",
    });
  else {
    const passHash = bcrypt.hashSync(password, 10);
    User.create({ userName, passHash })
      .then((user) => {
        response.redirect("/login");
      })
      .catch((error) => {
        if (error.code === 11000) {
          response.render("auth/signup", {
            errorMessage: `User "${userName}" already exists`,
          });
        } else {
          console.log("error creating user: ", error);
          next(error);
        }
      });
  }
});

router.get("/login", (request, response, next) => {
  response.render("auth/login");
});

router.post("/login", (request, response, next) => {
  const { userName, password } = request.body;
  if (userName === "" || password === "")
    response.render("auth/login", {
      errorMessage: "Name and Password required",
    });
  else {
    User.findOne({ userName })
      .then((user) => {
        if (user) {
          const passwordMatches = bcrypt.compareSync(password, user.passHash);
          if (passwordMatches) response.redirect(`/${user.userName}/profile`);
          else
            response.render("auth/login", {
              errorMessage: "Incorrect Password",
            });
        } else
          response.render("auth/login", {
            errorMessage: `No user "${userName}" exists`,
          });
      })
      .catch((error) => {
        console.log("Error getting user: ", error);
        next(error);
      });
  }
});

module.exports = router;
