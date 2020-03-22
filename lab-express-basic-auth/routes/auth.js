const express = require("express")
const router = express.Router();

const User = require("../models/user")

const bcrypt = require("bcrypt")
const bcryptSalt = 10;

router.get("/signup", (req,res,next)=> {
    res.render("auth/signup")
});


//Create a User using the signup Page 
router.post("/signup", (req,res,next)=> {
    const username  =   req.body.username
    const password  =   req.body.password
    const salt      =   bcrypt.genSaltSync(bcryptSalt)
    const hashPass  =   bcrypt.hashSync(password,salt)
    
//Checks if the username is filled by the User
    if (username === "" || password === ""){
        res.render("auth/signup", {
            errorMessage: "Please fill in the username, password and your email address"
        });
        return;
    }

//Checks if the username already exists in the database
    User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists!"
          });
          return;
        }
    });

    
// If the username is filled and the username doesnot exists in the database, user is created once the user clicks on the register button. 
    User.create({
        username,
        password: hashPass
    })
    .then(() => {
        res.redirect("/")
    })
    .catch(error =>{
        console.log(error)
    })

});


//Export the module. 

module.exports = router