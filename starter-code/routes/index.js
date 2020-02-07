const express = require('express');
const router  = express.Router();
const bcrypt  = require(`bcrypt`);
const Users   = require("../models/Users")




router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/signup', (req, res, next) => {
  const saltRounds = 10;
  if (req.body.username.trim() === "" || req.body.password.trim() === ""){
    res.json({error:true, reason: "Username or password name are empties"});
    return;
  }
  const plainPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword,salt);

  Users.findOne({ name: req.body.username}).then((userFound) => {
    if (userFound !== null) {
      res.json ({error: true, reason: "User already exist"});
    } else {
      Users.create({username: req.body.username , password: hash})
      .then((userCreated) => {
        res.redirect("login");
      })
      .catch(() => {
        res.json ({created:false})
      })
    }
  })
});

router.post('/login', (req, res, next) => {
  if (req.body.username.trim() === "" || req.body.password.trim() === "") {
    res.json({error:true, reason: "Username or password name are empties"});
    return;
  }
  Users.findOne({username:req.body.username}).then((foundUser) => {
    if (foundUser) {
      if(bcrypt.compareSync(req.body.password, foundUser.password)) {
        res.json({error:false, msg: "Logged in"})
      } else res.json({error:true, msg: "password dont match"})
    } else {res.json({error:true, msg:"user not found"})}
  })
});



module.exports = router;
