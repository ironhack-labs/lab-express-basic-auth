const { Router } = require ("express");
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');


router.get('/signup', (req, res ) => res.render('signup'));

let saltRounds = 8;

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
                username,
                passwordHash: hashedPassword
            })
    })
    .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('/');
      })
      .catch(error => next(error));
  });
  
  router.get('/userProfile', (req, res) => res.render('users/user-profile'));

  router.get("/login", (req, res) => 
  res.render("login")//, { userInSession: req.session.currentUser}
  )

  router.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    if (username === ""|| password === ""){
      res.render("/login", {
        errorMessage: "Please provide your username and password" });
      return;
    }

    User.findOne( {username} )
    .then(user => {
      if(!user){
        res.render("login", {
          errorMessage: "Username not found. Please sign up first"
        } );
        return;
      } 
      else if(bcryptjs.compareSync(password, user.passwordHash)){
        // req.session.currentUser = user;
        res.render("profile", {user});
        }
        else{
          res.render("/login", {
            errorMessage: "Provided Password Is Incorrect"})}
          })
        .catch(error => next(error));
    });
 
  module.exports = router;