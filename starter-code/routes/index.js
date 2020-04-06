const express = require('express');
const router  = express.Router();
const bcrypt =require('bcrypt')
const User = require('../models/user');
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



// -- Signup

//get
router.get('/signup', (req, res, next) => {
  res.render('signup-form');
})

//post 
router.post('/signup', (req, res) => {
  const {username, password} = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render('signup-form', {errorMessage: 'please type your username and passwords'})
    return;
  }
  
  User.create({
    username, 
    password: hashPass
  }).then(user =>{
    // res.send('/login')
    res.send(user)
  }).catch(err => res.render('signup-form', {errorMessage: 'This user alredy exist'}))
});


// -- Login

router.get('/login', (req, res) => {
  res.render('login-form');
})

router.post('/login', (req, res) => {
  const {
    username,
    password
  } = req.body

User.findOne({username})
    .then(user => {

      //check password
      if (!user) {
        res.render('login-form', {
          errorMessage: 'invalid username or password'
        })
        return;
      }

       // If exists, check the password
       if(bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/')
      } else {
        res.render('login-form', {
          errorMessage: 'ivalid password or username'
        })
      }
    })
    .catch(err => console.log(err))
})




// ---------- PRIVATE ROUTES ------------

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});


router.get('/main', (req, res) => {
  res.render('main')
})

router.get('/private', (req, res) => {
  res.render('private')
})






module.exports = router;
