const router = require("express").Router();
const mongoose = require('mongoose');
const User = require('../models/User.model.js');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

/* GET Signup page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req,res)=>{
    const {username, password} = req.body
    
    //Make sure all inputs have values
    if(!username || !password){
        res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please add your username and/or password.'});
        return;
    }
    //Make sure Password has the necessary requirements
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)){
        res.status(500).render('auth/signup', {errorMessage: 'Password needs to have at least 6 characters, 1 lowercase letter and 1 uppercase letter'});
        return;
    }

    async function createUser (){
        try{
            //encrypt password
            let salt = await bcryptjs.genSalt(saltRounds);
            let hashedPassword = await bcryptjs.hash(password, salt);
            //create User
            let user = req.body.username
            await User.create({username, passwordHash: hashedPassword})
            res.render('user/profile', {user})
        }
        catch(error){
            if(error instanceof mongoose.Error.ValidationError){
            res.status(500).render('auth/signup', {errorMessage: error.message});
            } 
            else if (error.code === 11000){
                res.status(500).render('auth/signup', {errorMessage: 'Username and email must be unique. Choose an username / email that are original, if you may.', });
            }
            else{
                console.log(error);
                res.redirect('/signup')
            }
        }
    }
    createUser()

})


module.exports = router;