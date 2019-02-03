const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const bcrypt = require ("bcrypt")


const saltRounds = 10

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next)=>{
  let user = req.body.username
  let password = req.body.password

  if (user.length === 0 || password.length === 0){
    res.render('error')
    return
  }

  User.findOne({"user": user})
    .then(data =>{
      if (data !== null){
        res.render('error')
        return
      }
    })
  
    let salt  = bcrypt.genSaltSync(saltRounds);
    let hashedPass = bcrypt.hashSync(password, salt);

    User.create( { "user": user, "password": hashedPass } )
      .then(()=>{
        res.render('index')
      })
      .catch(()=> res.render('error'))
    // let hashedPass = encryptionMiddleware(password)


  // User.create( { "user": user, "password": password } )
  //   .then(data => {
  //     console.log(data)
  //   })
  //   .catch(error => {
  //     res.redirect('../views/error.hbs')
  //   })
  // console.log(req)
})

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next)=>{
  let user = req.body.username
  let password = req.body.password

  if (user === "" || password === "") {
    res.render("error", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ user })
  .then(user => {
      if (!user) {
        res.render("error", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        res.redirect("/logged");
      } else {
        res.render("error", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
})

router.get('/logged', (req, res, next) => {
  res.render('logged');
});

router.get('/welcome', (req, res, next) => {
  res.render('index');
});



module.exports = router;
