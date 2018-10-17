const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt     = require('bcrypt');
const saltRounds = 10;
const middlewares = require('../middlewares/middlewares')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET SIGNUP*/
router.get('/signup',middlewares.isAnon, (req,res,next) =>{
  res.render('users/signup', {error: "no hay error"});
})

router.post('/signup',middlewares.isAnon, middlewares.emptyFields, middlewares.isCreated, (req,res,next) =>{
  const {username, password} = req.body;
  const salt  = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.create( {username, password: hashedPassword})
  .then((result) =>{
    res.redirect("/users/signup")
  })
  .catch(next);
})

// GET Y POST LOGIN

router.get('/login',middlewares.isAnon, (req,res,next) =>{
  res.render('users/login', {error: "no hay error"});
})

router.post('/login',middlewares.isAnon, middlewares.emptyFields, (req, res, next) =>{
  const {username, password} = req.body;

  User.findOne({username})
  .then(user =>{
    if(!user){
      return res.render('users/login', {error: "usuario y/o contraseña incorrecta"})
    }
    if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/users/profile');
    } else {
      res.redirect('/users/login');
    }
  })
  .catch(next)
} )

//GET PROFILE
router.get('/profile',middlewares.isLogged, (req,res,next) =>{
  res.render('users/profile');
})


module.exports = router;
