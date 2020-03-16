const express = require('express');
const router = express.Router();

//Added the model

const User = require('../models/user');

//Require bycypt

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next)  => {
  res.render('index');
});


// Render signup 
router.get('/signup', (req,res,next) => {
  res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
  const { username, password} = req.body;
  /* const salt = bcrypt.genSaltSync(bcryptSalt);
  const hassPass = bcrypt.hashSync(password, salt); */

  //check if username and password are not empty
if(username === '' || password === '') {
  res.render('auth/signup', {
    errorMessage: 'Indicate a username and password to signup'
  });
  return;
}

  //look for BD

User.findOne({username})
    .then(user => {
      if(user !== null) {
        res.render('auth/signup', {
          errorMessage: "The username already exists!"
        });
      return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hassPass = bcrypt.hashSync(password, salt);

      User.create({username, password:hassPass})
          .then(() => {
            res.redirect('/')
          })
          .catch(error => {
            next(error);
          });
    })
    .catch(error => {
      next(error);
    });
});

//render login
router.get('/login', (req,res,next) => {
  res.render('auth/login');
})

//check login data
router.post('/login', (req,res,next) => {
  const { username, password } = req.body;

//check username and password are not empty
    if(username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Indicate a username and password to log in'
      });
      return;
    }

    User.findOne({username})
        .then(user => {
          if(!user) {
            res.render('auth/login', {
              errorMessage: "The username does not exist!"
            });
            return;
          }

          if(bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/user');
          } else {
            res.render('auth/login', {
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
    next(); // ==> go to the next route 
  } else {                          
    res.redirect("/login");        
  }                                
});

// renderizamos la plantilla secret.hbs con el username
// deconstruimos en la variable username el username de req.session.currentUser
   
router.get("/user", (req, res, next) => {
  const {username} = req.session.currentUser
  res.render("user", {username});
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // cannot access session here
    res.redirect("/");
  });
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});




module.exports = router;