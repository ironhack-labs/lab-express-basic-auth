const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

router.get(("/signup"), (req, res, next)=>{
    res.render("auth/sign-up")
});

router.post(("/signup"), (req, res, next)=>{
    const saltRounds = 10;
    const {username, password} = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then((salt)=>{
        return bcryptjs.hash(password, salt);
    })
    .then((hashedPassword)=>{
        return User.create({username, password: hashedPassword});
    })
    .then((user)=>{
        console.log("User was added:", user);
        res.redirect("/");
    })
    .catch((err)=>{
        next(err);
    })
});



module.exports = router;



