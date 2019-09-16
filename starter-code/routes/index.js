const express = require('express');
const router  = express.Router();
const Users = require("../models/users");
const bcrypt = require("bcrypt");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})


router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/signup?error=empty");
  }


  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      const saltRounds = 5;

      const salt = bcrypt.genSaltSync(saltRounds);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      Users.create({ username: username, password: encryptedPassword }).then(
        createdUserData => {
          res.redirect('/login');
        }
      );
    } else {
      res.redirect("/signup?error=user-exists");
    }
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/login?error=empty");
  }

  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      res.redirect("/login?error=user-doesnot-exist");
    } else {
      const bcrypt = require("bcrypt");
      // yields: $2b$05$XGEx8RA6EKGsaW2Za1fS9usMAkGpmFvubJGq6a8jyIrDD0n/0LwhW
      const hashedPassword = foundUserData.password;

      if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.user = foundUserData._id;
        res.redirect("/private");
      } else {
        res.redirect("/login?error=wrong-password");
      }
    }
  });
});


module.exports = router;