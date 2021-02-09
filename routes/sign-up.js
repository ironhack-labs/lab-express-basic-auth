var express = require("express");
var signupRouter = express.Router();
const User = require("./../models/User.model");

//bcrypt
const bcrypt = require("bcryptjs");
const saltRounds = 10;
//get
signupRouter.get("/", (req, res) =>{
    res.render("log-in");
});

//post
signupRouter.post("/", (req,res) => {
    const {password, username} = req.body;

    if (username === "" || password === ""){
        res.render("sign-up", {
            errorMessage: "Username & password are required"
        });
        return;
    }

    User.findOne ({username})
    .then(userFound => {
        if (userFound){
            res.render("sign-up", {
                errorMessage: "Username is already in use"
            });
            return;
        }

        const salt = bcrypt.genSaltSync(saltRounds); //security string for password
        const hashedPassword = bcrypt.hashSync(password, salt);

        const pr = User.create({ username, password:hashedPassword });
        return pr;
    })
    .then(createdUser =>{
        req.session.currentUser = createdUser;
        res.redirect("/");
    })
    .catch (() =>{
        res.render("sign-up", {
            errorMessage: "Error during sign up."
        });
    });

});

module.exports = loginRouter;