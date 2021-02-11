const router = require("express").Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');


//sigup 
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

//login 
router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const {username, password} = req.body; 
    User.findOne({username: username})
    .then(userFromDB => {
        if (userFromDB === null){
        res.render('login', {message: 'Invalid username'}); 
        return; 
    }
    if (bcrypt.compare(password, userFromDB.password)){
        req.session.user = userFromDB;
        res.redirect('/main'); //create a hbs file and then put the new name here
    } else {
        res.render('login', {message: 'Invalid password'});
    }
    })
})

// the signup form post to this route
router.post("/signup", (req, res) => {
    //get username and password
    const {username, password} = req.body; 
    if (password.length <8) {
        res.render('signup', {message: 'Your password has to be 8 chars min'});
        return
    }
    if (username === ''){
        res.render('signup', {message: 'Your usernama cannot be empty'});
        return
    }
    //check if the username already exists 
    User.findOne({username: username})
    .then(userFromDB =>{
        if (userFromDB !== null) {
            res.render(signup, {message: 'Username already taken'});
        } else {
            // all validation passed - > we can create a new user in the database with a hashed password
            // create salt and hash
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            //create tthe user in the DB 
            User.create({username: username, password: hash})
            .then(userFromDB =>{
                //then redirect to login page 
                res.redirect('/'); 
            })
        }
    })
    .catch(err =>{
        console.log(err);
    })
})


// middleware to check if the user is logged in
const loginCheck = () => {
    return (req, res, next) => {
      // if user is logged in proceed to the next step
      if (req.session.user) {
        next();
      } else {
        // otherwise redirect to /login
        res.redirect('/login');
      }
    }
  }

router.get('/main', loginCheck(), (req, res) => {
    res.render('main');
})

router.get('/private', loginCheck(), (req, res) => {
    res.render('private');
})



//logout 
router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    })
  })


module.exports = router; 