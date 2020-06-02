const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')


router.get('/signup', (req, res) => {
    console.log('connected')
    res.render('auth/signup.hbs')

})

router.post('/signup', (req, res) => {
    const {username, email, password } = req.body;
    console.log(username, email, password);

    if(!username || !email || !password) {
        res.status(500)
        //render same page with error message
        .render('auth/signup.hbs', {
            errorMessage: 'Please enter username, email and password'
    
        });
    return; 
    }


    //Authenticate email
    const emailRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!emailRegex.test(email)) {
      res.status(500)
          .render('auth/signup.hbs', {
            errorMessage: 'Email format not correct'
          });
        return;  
    }

    //Authenticate password
    const passReg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!passReg.test(password)) {
        res.status(500)
            .render('auth/signup.hbs', {
              errorMessage: 'Password needs to contain at least 8 characters, at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character, at least 1 numeric character, at least one special character.'
            });
          return;  
      }
    
    //Encrypt password and send it to compass
    bcrypt.genSalt(12)
    .then((salt) => {
        console.log('Salt is', salt);
        bcrypt.hash(password, salt)
        .then((passwordHash) => {
            UserModel.create({email, username, passwordHash})
            .then(() => {
                //Redirect to Profile Page
                res.redirect('/main'); 
            })
            //Catch errors
            .catch((err) => {
                if (err.code === 11000) {
                  res.status(500)
                  .render('auth/signup.hbs', {
                    errorMessage: 'username or email entered already exists!'
                  });
                  return;  
                } 
                else {
                  res.status(500)
                  .render('auth/signup.hbs', {
                    errorMessage: 'Something went wrong! Go to sleep!'
                  });
                  return; 
                }
              });
          });  
  });

});





router.get('/signin', (req, res) => {
    res.render('auth/signin.hbs')
})



router.post('/signin', (req, res) => {
    const {email, password } = req.body;
    console.log(email, password);
    //Authenticate email
    if(!email || !password) {
        res.status(500);
       
        //render same page with error message
        res.render('auth/signup.hbs', {errorMessage: 'Please enter username, email and password'
    }); 
    return;
    }

    //Authenticate email
    const emailRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!emailRegex.test(email)) {
      res.status(500)
          .render('auth/signup.hbs', {
            errorMessage: 'Email format not correct'
          });
        return;  
    }

    UserModel.findOne({email})
    .then((userData) => {
        
         //check if passwords match
        bcrypt.compare(password, userData.passwordHash)
        
          .then((doesItMatch) => {
            
              if (doesItMatch) {
                console.log(userData)
                //req.session is available from middleware(loggedInUser is an arbitrary name)
                //setting it as the value of userData so we can access it globally
                req.session.loggedInUser = userData;

                //redirect to profile page 
                res.redirect('/main');
              }
              else {
                res.status(500)
                  .render('auth/signin.hbs', {
                    errorMessage: 'Passwords don\'t match'
                  });
                return; 
              }
              
          })
          .catch((err) => {
            console.log(err)  
            res.status(500)
            
            .render('auth/signin.hbs', {
              errorMessage: 'Something wen\'t wrong!'
            });
            return; 
          });
    })
    
    .catch(() => {
      res.status(500)
        .render('auth/signin.hbs', {
          errorMessage: 'Cannot Find User'
        });
      return;  
    })

});

//Route to Profile page
router.get('/main', (req, res) => {
     if(req.session.loggedInUser){
        res.render('users/main.hbs');
     } else {
         res.send('Get out!');
     }
    
})

//Route to Private page
router.get('/private', (req, res) => {
    if(req.session.loggedInUser){
       res.render('users/private.hbs');
    } else {
        res.send('Get out again!');
    }
   
})

module.exports = router;