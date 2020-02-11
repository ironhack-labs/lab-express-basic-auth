const express = require('express');
const loginRouter = express.Router();
const User = require('./../models/User');
const bcrypt = require('bcrypt')
const zxcvbn = require("zxcvbn");
const saltRounds = 10;



//GET route to get login
loginRouter.get('/', (req, res, next) => {
    res.render('auth/login');
});

//POST route to get data
loginRouter.post('/', (req, res, next) => {
    const { username, password} = req.body;
    console.log("Print req.body", req.body)
    if(username === "" || password === ""){
        res.render("auth/login", {
            errorMessage: "Please provide the required username and password"
        });
        return;
    };
    User.findOne({username})
    .then( (user) => {
        if (!user) {
            res.render("auth/login", {
                errorMessage: "Incorrect username"
        });
        return;
    }

    const passwordFromDB = user.password;
    const passwordCorrect = bcrypt.compareSync(password, passwordFromDB);

    if (passwordCorrect) {
        req.session.currentUser = user;
        res.redirect('/')
        } else {
        res.render("auth/login", {
            errorMessage: "Incorrect password"
        });
        }
    }) .catch(err => console.log(err));
});


module.exports = loginRouter;