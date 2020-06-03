const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');


router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs');
});

router.post('/signup', (req, res) => {
    const {username, password } = req.body;
    console.log(username, password);

    
    if (!username || !password) {
        res.status(500)
          .render('auth/signup.hbs', {
            errorMessage: 'Oups, you need to enter your username and password'
          });
        return;  
    }

    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{5,})/);
    if (!myPassRegex.test(password)) {
      res.status(500)
          .render('auth/signup.hbs', {
            errorMessage: 'Password needs at least 5 characters, a number and an Uppercase alphabet'
          });
        return;  
    }

    bcrypt.genSalt(12)
      .then((salt) => {
        console.log('Salt: ', salt);
        bcrypt.hash(password, salt)
          .then((passwordHash) => {
            UserModel.create({username, passwordHash})
              .then(() => {
                res.redirect('/main');
              })
              .catch((err) => {
                if (err.code === 11000) {
                  res.status(500)
                  .render('auth/signup.hbs', {
                    errorMessage: 'This username already exists!'
                  });
                  return;  
                } 
                else {
                  res.status(500)
                  .render('auth/signup.hbs', {
                    errorMessage: 'Something went wrong! '
                  });
                  return; 
                }
              })
          });  
  });

});

  // Find if the user exists in the database 
  UserModel.findOne({username})
    .then((userData) => {
         //check if passwords match
        bcrypt.compare(password, userData.passwordHash)
          .then((doesItMatch) => {
              //if it matches
              if (doesItMatch) {
                // req.session is the special object that is available to you
                
                req.session.loggedInUser = userData;
                res.redirect('/main');
              }
              //if passwords do not match
              else {
                res.status(500)
                  .render('auth/signin.hbs', {
                    errorMessage: 'Passwords don\'t match'
                  });
                return; 
              }
          })
          .catch(() => {
            res.status(500)
            .render('auth/signin.hbs', {
              errorMessage: 'Something wen\'t wrong!'
            });
            return; 
          });
    })
    //throw an error if the user does not exists 
    .catch(() => {
      res.status(500)
        .render('auth/signin.hbs', {
          errorMessage: 'Something went wrong'
        });
      return;  
    });


router.get('/main', (req, res) => {
    res.render('users/main.hbs', {userData: req.session.loggedInUser});
})


router.get("/main", (req, res) => {
    if (req.session.loggedInUser) {
      res.render("profile/main.hbs");
    } else {
      res.send("Your not authorized, tried again");
    }
  });
  
  router.get("/private", (req, res) => {
    if (req.session.loggedInUser) {
      res.render("profile/private.hbs");
    } else {
      res.send("Your not authorized, tried again");
    }
  });

module.exports = router;
