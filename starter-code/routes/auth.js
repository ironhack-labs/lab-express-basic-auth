const express = require('express');
const router = express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;


//Rendering the form to sign up
router.get("/signup", (req, res, next) => {
    try {
        res.render("auth/signup");
    } catch (e) {
        next(e);
    }
});



//Rendering the form to login in
router.get("/login", (req, res, next) => {
    try {
        res.render("auth/login");
    } catch (e) {
        next(e);
    }
});


router.post('/login', (req,res,next) => {
    const {username, password} = req.body;
  
  
    if(username ==="" || password===''){
      res.render('auth/login', {
        errorMessage: 'Please enter both username and password'
      })
    }
  
    User.findOne({"username": username})
    .then(user => {
  
      if(!user){
        res.render('auth/login', {
          errorMessage: 'The username does not exist'
        })
      }
  
      if (bcrypt.compareSync(password, user.password)) {
        
        req.session.currentUser = user;
        res.redirect('/');
  
      } else {
        res.render('auth/login', {
          errorMessage : "Incorrect password"
        });
      }
  
    })
  })

// Posting the user to mongoose
router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    //Checking if fields are not filled
    if (username === '' || password === '') {
        res.render('auth/signup', {
            errorMessage: "indicate a username and password"
        })
        return;
    }

    //Checking if user exists
    User.findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The user already exists"
                });
                return;
            }

            //create user in db
            User.create({ username, password: hashPass })
                .then(() => {
                    res.redirect('/');
                })
                .catch(error => {
                    next(error);
                })

        });

});





module.exports = router;
