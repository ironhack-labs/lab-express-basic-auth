const mongoose = require ('mongoose');
const User = require ('../models/user');
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');


router.get('/', (req, res, next)=>{
  res.render('login/login');
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  console.log(req.session)

  if (theUsername === "" || thePassword === "") {
    res.render("login/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});


router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
// router.get("/secret", (req, res, next) => {
//   res.render("secret");
// });

router.get("/main", (req, res, next)=>{
res.render('login/main')
})

router.get("/private", (req, res, next)=>{
res.render('login/private')
})



module.exports=router;