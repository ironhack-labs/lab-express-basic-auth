const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require ('../models/User.model');


//sigup 
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

// the signup form post to this route
router.post("/signup", (req, res) => {
    //get username and password
    const {username, password} = req.body; 
    if (password.length <8) {
        res.render('signup', {message: 'Your password has to be 8 chars min'});
        return
    }
    if (username === ''){
        res.render('signup', {message: 'Your usernama cannot be empty'});
        return
    }
    //check if the username already exists 
    User.findOne({username: username})
    .the(userFromDB =>{
        if (userFromDB !== null) {
            res.render(signup, {message: 'Username already taken'});
        } else {
            // all validation passed - > we can create a new user in the database with a hashed password
            // create salt and hash
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            //create tthe user in the DB 
            User.create({username: username, password: hash})
            .then(userFromDB =>{
                //then redirect to login page 
                res.redirect('/'); 
            })
        }
    })
    .catch(err =>{
        console.log(err);
    })
})


module.exports = router; 