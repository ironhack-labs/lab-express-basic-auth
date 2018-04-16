const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

const bcryptSalt = 10;

router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.post("/signup",(req,res) => {
    let{username,password}=req.body;
    console.log(username)
    User.findOne({username:username},"username",(err,user) => {
        if (user !== null){
            res.render("auth/signup", {
                errorMessage:"El usuario ya existe"
            });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password,salt);

        const newUser = User({
            username,
            password:hashPass
        });

        newUser.save(err =>{
            res.redirect("/");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("auth/login");
})

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Indica un usuario y/o constraseña para registrarte"
        });
        return;
    }
    User.findOne({
        username: username
    }, (err, user) => {
        if (err || !user) {
            res.render("auth/login", {
                errorMessage: "El usuario no existe"
            });
            return;
        }

        if (bcrypt.compareSync(password, user.password)) {

            req.session.currentUser = user;
            res.redirect("/");
        } else {
            res.render("auth/login", {
                errorMessage: " La contraseña es incorrecta"
            });
        }
    });
})



module.exports = router;