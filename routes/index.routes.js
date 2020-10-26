const express = require('express');
const router = express.Router();
const User=require('../models/User.model')
// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
// const { findOne } = require("../models/user");
const bcryptSalt = 10;

/* GET home page */
// router.get('/', (req, res, next) => res.render('index'));
// router.get('/', (req, res, next) => res.render('signup'));

router.get('/',(req, res, next) => {
    // if hay un usuario en sesión (si está logged in)
    // console.log(req.session)
    if (req.session!==undefined) {
      next();
    } else {
      res.render("index");
    }
});

router.get('/signup',(req,res,next)=>{
    res.render('signup');
})
router.post("/signup",async (req, res, next) => {
    // desestructuramos el email y el password de req.body
    const { userName, password } = req.body;
    
   // creamos la salt y hacemos hash del password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
  
    try {
      // creamos el usuario y luego redirigimos a '/'
      await User.create({
        userName,
        password: hashPass,
      });
      res.redirect("/login");
    } catch (error) {
      next(error);
    }
})

router.get('/login',(req,res,next)=>{
    res.render('login');
})

router.post('/login',async (req,res,next)=>{
    // desestructuramos el email y el password de req.body
    const { userName, password } = req.body;
    // console.log(userName, password)
    if (userName === "" || password === "") {res.render("login", {errorMessage: "Indicate a username and a password to sign up"});return;}
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    try {
        const user = await User.findOne({ userName: userName });
        // console.log(user)
        if (!user) {res.render("login", {errorMessage: "The username doesn't exist."});return;}

        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.render("index");
        } else {
            res.render("login", {errorMessage: "Incorrect password"});
        }
        // res.redirect("/");
        // res.render('login', {errorMessage:"Succesfully Logged In"});
    } catch (error) {
        next(error);
    }
})

module.exports = router;
