const { Router } = require('express');
const router = new Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");



//sending a file that will render and display the form to users.
router.get("/signup", (req, res, next) => {
    res.render("signup")
})

// get the information user inputted in the form and properly store them in the database.
router.post("/signup", (req, res, next) => {
    console.log('The form data: ', req.body);


    if (!username || !email || !password) {
        res.render('signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }

    //apply the hashing algorithm inside the post route in order to encrypt the password
    const salt = bcrypt.genSaltSync(10); //<--10 is the saltrounds for the bcrypt
    const pwHash = bcrypt.hashSync(req.body.password, salt);

    User.create({ username: req.body.username, password: pwHash })
        .then((newuser) => {
            console.log(`Password hash: ${pwHash}`);
            res.redirect("user-profile")
        })
        .catch(error => next(error));
})


//to display the login form to users
router.get('/login', (req, res) =>
    res.render('login'));


//render the page of the user after the login.
router.get('/user-profile', (req, res) =>
    res.render('user-profile'));



module.exports = router;