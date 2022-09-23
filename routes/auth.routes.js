const router = require("express").Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');


const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware');

/* GET Sign Up page */
  router.get('/signup', isNotAuthenticated, (req, res, next) => {
    res.render('signup.hbs');
  });
  


router.post('/signup', (req, res, next) => {
    console.log(req.body);
  
    const myUsername = req.body.username;
    const myPassword = req.body.password;
  
    //USE BCRYPT HERE
    const myHashedPassword = bcryptjs.hashSync(myPassword);
  
    User.create({
      username: myUsername,
      password: myHashedPassword
    })
      .then(savedUser => {
        console.log(savedUser);
        res.redirect('login');
      })
      .catch(err => {
        console.log(err);
        res.send('The username already exists. Please visit the log in page');
      })
  });





  /* GET Log In page */
router.get('/login', (req, res, next) => {
    res.render('login.hbs');
  });

router.post('/login', (req, res, next) => {
    console.log(req.body);
  
    const myUsername = req.body.username;
    const myPassword = req.body.password;
  
    User.findOne({
      username: myUsername
    })
      .then(foundUser => {
  
        console.log(foundUser);
  
        if(!foundUser){
          res.send('This username does not exist, please sign up');
          return;
        }

        const isValidPassword = bcryptjs.compareSync(myPassword, foundUser.password)
  
        if(!isValidPassword){
          res.send('The password is incorrect');
          return;
        }

        console.log(req.session);
  
        req.session.user = foundUser;

        console.log(req.session);
  
        res.send('You logged in!')
        
      })
      .catch(err => {
        res.send(err)
      })
  });





  router.get('/main', isAuthenticated, (req, res, next) => {
    res.render('main.hbs');
  });


  router.get('/private', isAuthenticated, (req, res, next) => {
    res.render('private.hbs');
  });


  router.get('/protected', isAuthenticated, (req, res, next) => {
    res.send('this route is protected')
  })


module.exports = router;
