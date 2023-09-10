const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model.js");

const saltRounds = 10;

router.get("/user/register", (request, response) => {
  response.render("user/register.hbs");
});

router.post("/user/register", (request, response) => {
  const { username, password } = request.body;

  if (username === "") {
    response.render("user/register.hbs", {
      userNameError: "username cant be empty",
    });
    return;
  }

  if (password === "") {
    response.render("user/register.hbs", {
      passwordError: "password cant be empty",
      username: username,
    });
    return;
  }

  bcryptjs.genSalt(saltRounds).then((salt) =>
    bcryptjs
      .hash(password, salt)
      .then((hashedPasswd) => {
        return User.create({ username: username, password: hashedPasswd });
      })
      .then(() => {})
      .catch((err) => {
        if (err.code === 11000) {
          // dulicate mongo code
          response.render("user/register.hbs", {
            errorMessage: "username already exists",
            username: username,
          });
          return;
        }
      })
  );
});

router.get("/user/login", (request, response) => {
  response.render("user/login.hbs");
});

router.post("/user/login", (request, response) => {
  const { username, password } = request.body;

  if (username === "") {
    response.render("user/login.hbs", {
      userNameError: "username cant be empty",
    });
    return;
  }

  if (password === "") {
    response.render("user/login.hbs", {
      passwordError: "password cant be empty",
      username: username,
    });
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (!user) {
      response.render("user/login", {
        errorMessage: "username does not exists",
      });
      return;
    } else if (bcryptjs.compareSync(password, user.password)) {
      request.session.currentUser = user;
      response.redirect("/user/profile");
      return;
    } else {
      response.render("user/login", {
        errorMessage: "password incorrect",
      });
      return;
    }
  });
});

router.get("/user/profile", (request, response) => {
  if (!request.session.currentUser) {
    response.redirect("/user/login");
    return;
  }

  response.render("user/profile.hbs", {
    userName: request.session.currentUser.username,
  });
});

router.get("/user/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      next(error);
    }

    response.redirect("/user/login");
  });
});


module.exports = router;
