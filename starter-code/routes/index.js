const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../models/Users");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);



/* GET home page - SignUp */
router.get('/', (req, res, next) => {
  res.render('index');
})

//Creación Usuario
router.post("/create-user", (req, res, next) => {
  if (req.body.username.trim() === "" || req.body.password.trim() === "") {
    res.json({
      error: true,
      msg: "Username or password are empty"
    });

    return;
  }

  Users.findOne({ username: req.body.username }).then((foundUser) => {
    if (foundUser) {
      res.json({
        error: true,
        msg: "Username already taken"
      });

      return;
    } else {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);

      // res.json({
      //   username: req.body.username,
      //   password: req.body.password,
      //   hashedPassword: hash
      // });

      Users.create({
        username: req.body.username,
        password: hash
      }).then(() => {
        res.json({
          userCreated: true,
          timestamp: new Date()
        });
      });
    }
  });
});

//Login
router.get("/login", (req, res, next) => {
  res.render("login");
});

//log user
router.post("/login", (req, res, next) => {
  if (req.body.username.trim() === "" || req.body.password.trim() === "") {
    res.render('login', {
      error: true,
      msg: "Username or password are empty"
    });

    return;
  }

  Users.findOne({ username: req.body.username }).then((userFound) => {
  if (userFound) {
    if (bcrypt.compareSync(req.body.password, userFound.password)) {
      //continue login
      req.session.currentUser = userFound._id;
      res.redirect("/private");
      // res.json({ authorised: true });
    } else {
      // notFound("password or user are wrong");
      res.render("login", {error: "password is wrong"})
    }
  }else {
    res.render("login", {error: "User not found"})
    // res.json({
    //   error: true,
    //   msg: "User not found"
    // });
  }
});
});


router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    Users.findById(req.session.currentUser).then((allUserData) => {

      //res.json(allUserData)
      //allUserData.name = `${allUserData.name.toUpperCase()}` 

      res.render("private", {
        user: allUserData
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    Users.findById(req.session.currentUser).then((allUserData) => {

      //res.json(allUserData)
      //allUserData.name = `${allUserData.name.toUpperCase()}` 

      res.render("main", {
        user: allUserData
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;