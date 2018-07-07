const express = require("express");
const authRoutes = express.Router();

const User  = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
})

authRoutes.post("/signup", (req,res,next) =>{
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
        username, 
        password: hashPass
    });    

    if(username === "" || password === ""){
        res.render("auth/signup", {
            errorMessage: "Fill in the blanks 🐸"
        });
        return;
    }

    User.findOne({"username": username}, "username", (err,user) => {
        if( user !== null){
            res.render("auth/signup", {
                errorMessage: "Change the username"
            })            
            return;
        }
        
        newUser.save((err) => {
            if(err){
                res.render("auth/signup", {
                    errorMessage: "Todo está mal. Si hay error. Si hay error."
                });
            } else {
                res.redirect("/");
                console.log("No hay error. No hay error.")
            }
        })
    })
} )

authRoutes.get("/login", (req,res,next) => {
    res.render("auth/login");
})

authRoutes.post("/login", (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username === "" || password === ""){
        res.render("auth/login", {
            errorMessage: "Fill in the blanks. 🙄"
        })
        return;
    }

    User.findOne({"username": username}, (err,user)=>{
        if(err || !user){
            res.render("auth/login", {
                errorMessage: "The username doesn't exist"
            });
            return
        }
        if (bcrypt.compareSync(password, user.password)){
            req.session.currentUser = user;
            res.redirect("/");
        } else{
            res.render("auth/login", {
                errorMessage: "Shit. That's not your password. 💩 "
            })
        }
    })
})

authRoutes.get("/logout", (req,res,next) => {
    req.session.destroy((err) => {
        res.redirect("/login");
    })
})

module.exports = authRoutes;