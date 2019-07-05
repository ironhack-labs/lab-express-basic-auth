const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//////////Sign up routes

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const salt     = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  const users = await User.find({username})

   if(users.length !== 0){
     return res.render('auth/signup', {
       errorMessage: 'User already exists'
     })
   }

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.create({
    username,
    password: hashPass
  })
  .then(()=>{
    res.redirect('/')
  })
  .catch(()=>{
    console.log(error)
  })
})

////////////Login routes

router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login up."
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
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

/////////////private routes

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                          
    res.redirect("/login");    
  }                            
});

router.get("/main", (req, res, next) => {
  res.render("auth/main")
})

router.get("/private", (req, res, next) => {
  res.render("auth/private");
});

module.exports = router
