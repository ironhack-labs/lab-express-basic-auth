var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");

const User = require('../models/user');
const bcryptSalt = 10;

router.get('/signup', (req, res, next )=>{
    
    res.render('signup');
});
 router.post('/', (req, res, next)=>{
     const username = req.body.username;
     const password = req.body.password;
    
     var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);
  
    var newUser = User({
        username,
        password: hashPass
    });

    newUser.save((err) => {
        res.redirect("/");
    });
 });

 router.get('/login', (req, res, next)=>{
    res.render('login');
 });
router.post('/login', (req, res, next)=>{
    const username = req.body.username;
     const password = req.body.password;
    //check server
     if (username === "" || password === "") {
    return res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  }

    User.findOne({"username": username}, (err, user)=>{
        if(err || !user){
            return res.render("login", {
                errorMessage: "The user doesn´t exist"
            });
        }
        if(bcrypt.compareSync(password, user.password)){
         req.session.currentUser = user;
         res.redirect('/secret');

     } else {
         res.render("login", { errorMessage: "Incorrect password"})
     }
    });

});





module.exports = router;