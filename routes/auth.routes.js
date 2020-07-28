const express = require("express"); 
const router = express.Router();

//I-1 Use "User" model
const User = require("../models/User.model");//searches const "User" in /model/User.model

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//I-1 render hbs when it goes to sign up
router.get ("/signup", (req, res, next) => res.render("auth/signup.hbs")); //es el nombre .hbs

//I-1 POST route to get info from signup form
router.post('/signup', (req, res, next) => {
    //gets form values
    const { username, password } = req.body;

    //B-1 if emptyfields, render /signup 
    if (username === "" || password === "" ) {
        res.render ("auth/signup.hbs", {
            errorMessage: "DUDE, give me a username and a password to sign you up",
        });
        return
    }

    //I-1 makes sure if user doesn't exist
    User.findOne({username})
        .then((user) => { 
            if (user !==null) {
                res.render('auth/signup.hbs', {
                    errorMessage: "Dude, someone already thought of that username, give me another one"
                });
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync (password, salt);

            User.create({ username, password: hashPass })
            .then(() => {
                res.redirect("/");
            })
            .catch((error) => {
                console.log('Error while saving the user in the DB', error);
            });
        })
        .catch ((error) => {
            next(error);
        });

})


//----------------------------------------------------------


//I-2 render hbs when it goes to login
router.get ("/login", (req, res, next) => res.render("auth/login.hbs")); //es el nombre .hbs

//I-2 POST route to get info from login form
router.post('/login', (req, res, next) => {
    //saves info of form values
    const { username, password } = req.body;

    //B-1 if emptyfields, render /login (this is the same as signup but with "login") 
    if (username === "" | password === "" ) {
        res.render ("auth/login.hbs", {
            errorMessage: "DUDE, give me your username and password to log you in",
        });
        return
    }

    //I-2 Search user in DataBase
    User.findOne({username})
        .then((user) => { 
            if (!user) {
                res.render('auth/login.hbs', {
                    errorMessage: "Something is wrong dude, check your spelling or something"
                });
                return;
            }
            //if there is an user, must compares with form password 
            if (bcrypt.compareSync(password,user.password)) {
                //it also saves login in session
                req.session.currentUser = user;
                res.redirect('/')
                // res.redirect('/?user=$(req.session').... falta
            } else {
                res.render("auth/login.hbs", {
                    errorMessage: "Incorrect password"
                })
            }  
        })
        .catch ((error) => {
            next(error);
        })

})



module.exports = router;