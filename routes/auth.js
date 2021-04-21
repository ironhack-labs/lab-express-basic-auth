const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

///////
router.get("/signup", (req, res, next) => {
    res.render("signup");
});
  

///////
router.get("/login", (req, res, next) => {
  res.render("login");
});


///////
router.post('/homepage', (req, res, next) => {
  const { username, password } = req.body;
  
  // CHECK IF THE USER IS IN THE DATABASE
  User.findOne({ username: username })
    .then(userFromDB => {
      if (userFromDB === null) {
        // IF NO, SHOW LOGIN FORM AGAIN
        res.render('login', { message: 'Invalid credentials' });
        return;
      }
      // IF YES, CHECK THE PASSWORD
      if (bcrypt.compareSync(password, userFromDB.password)) {
      // IF PASSWORD MATCH, ASSIGN TO SEESION AND REDIRECT TO PROFILE
        req.session.user = userFromDB;        
        res.render('homepage');
      } else {
        res.render('login', { message: 'Invalid credentials' });
        return;
      }
    })
})


///////
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    // INPUT VALIDATION
    if (password === '' || password.length < 8) {
        res.render('signup', { message: 'Your password cannot be empty and must contain at least 8  characters' });
        return
      }
    if (username === '' || username.length < 8) {
        res.render('signup', { message: 'Your username cannot be empty and must contain at least 8 characters' });
        return
    }

    // CHECK THE DATABASE
    User.findOne({ username: username })
    .then(userFromDb => {
      if (userFromDb !== null) {
        res.render('signup', { message: 'This username is already taken' });
      
      } else {
        
    // ENCRYPTION
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        // console.log(hash);
    
    // CREATE USER
    User.create({ username: username, password: hash })
        .then(createdUser => {
        console.log(createdUser);
        res.redirect('login');
        })
      }
    })

});


 ///////
router.get('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      res.redirect('/');
    }
  })
});


module.exports = router;