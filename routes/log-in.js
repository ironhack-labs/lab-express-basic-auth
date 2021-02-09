var express = require("express");
var loginRouter = express.Router();
const User = require("./../models/User.model");

//bcrypt
const bcrypt = require("bcryptjs");

//get
loginRouter.get("/", (req, res) =>{
    res.render("log-in");
});

//post
loginRouter.post("/", (req,res) => {
    const{password, username} = req.body;

    if (username === "" || password === ""){
        res.render("log-in", {
            errorMessage: "Username & password are required"
        });
        return;
    }

    User.findOne ({username})
    .then(foundUser => {
        if (!foundUser){
            res.render("log-in", {
                errorMessage: "Username doesn't exist"
            });
            return;
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

        if (passwordCorrect) {
            req.session.currentUser = foundUser;
            res.redirect("/");
        } else{
            res.render("log-in", {
                errorMessage: "Password incorrect. "
            });
        }
    })
    .catch (err => console.log(err));

});

module.exports = loginRouter;