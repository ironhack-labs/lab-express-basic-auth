const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs'); //chamar bcrypt
const saltRounds = 10;
const User = require('../models/User'); 

//Route inicial
router.get('/signup', (req, res) => { 
    res.render('auth/signup');
  });


//Route para resultados do registo do user. Contem encriptação da password
//na BD, validações, paramentros para construçao da password no registo (regex), 
//Cria novo user e encaminha-o para route inicial.
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    if (username === '' || password === '') {
      res.render('auth/signup', 
      { 
        errorMessage: 'Indicate username and password'
      });
      return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.render('auth/signup', 
      { 
        errorMessage: `Password needs to have at least 6 characteres and must contain at least
        one number and one uppercase letter.
        `
      });
      return;
    }
    User.findOne({'username': username})
      .then((user) => {
        if(user) { // user !== undefined
          res.render('auth/signup', {
            errorMessage: 'The username already exists'
          });
          return;
        }
        User.create({ username, password: hashPassword})
          .then(() => {
            res.redirect('/');
          })
          .catch((error) => {
            if (error.code === 11000) {
              res.status(500).
              render('auth/signup', {
                errorMessage: 'Username and email need to be unique'
              })
            }
          })
      });
  });

////////////LOGIN USER - ITERATION 2

router.get('/login', (req, res) => { 
    res.render('auth/login');

});

///Processar a informação do form login
router.post('/login', (req, res) => {
    //console.log('SESSION =====> ', req.session);
    const {username, password} = req.body
  
  if (!username || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both username and password'
    });
    return;
  }

  User.findOne({'username': username})
  .then((user) => {
    if(!user) {
      res.render('auth/login', {
        errorMessage: 'Invalid Login'
      })
        return;
    }

    if (bcrypt.compareSync(password, user.password)) {
     
      req.session.currentUser = user; //set user to the session!
      res.redirect('/');
     //res.render('index', {user})
    } else {
      //Passwords don't match
      res.render('auth/login', {
        errorMessage: 'Invalid login'
      });
    }


  });

});

///////route para botao logout

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
  



module.exports = router;