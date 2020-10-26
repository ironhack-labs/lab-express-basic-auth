const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User.model');
// const withAuth = require('../helpers/middleware');

/* GET home page */
router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

/* GET signup page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

/* POST signup form */
router.post('/signup', async (req, res, next)=>{
    const user = req.body;
    try {
        // Check if mail and password has been filled.
       if(user.mail && user.password){
           // Check if the mail already exists on the database.
           if(await User.findOne({mail:user.mail})){
            res.render("auth/signup", {
                errorMessage: "Address Mail Already in Use.",
              });
              return;
           }
           // Create User
            const salt = await bcrypt.genSaltSync(10);
            const cypheredPwd = await bcrypt.hashSync(user.password, salt);
            const newUser = await User.create({
                mail: user.mail,
                password: cypheredPwd
            });
            res.render("auth/signup", {
                successMessage: "Signup Succeded.",
              });
        } 
    } catch (error) {
        next(error);
    }
});
/* GET Login */
router.get('/login', (req, res, next)=>{
    res.render('auth/login', )
});

/* POST Login */
router.post('/login', async(req, res, next)=>{
    const {mail, password} = req.body;
   try {
    if(mail && password){
        const user = await User.findOne({mail: mail});
        if(!user){
            res.render('auth/login', {
                errorMessage: "The username doesn't exist."
            });
            return;
        }
        if(bcrypt.compareSync(password, user.password)){
            req.session.currentUser = user;
            res.redirect('/');
        } else {
            res.render('auth/login', {
                errorMessage: "Incorrect Password"
            });
        }
    }
   } catch (error) {
       next(error);
   }
});


module.exports = router;
