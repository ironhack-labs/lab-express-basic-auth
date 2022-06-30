const router = require("express").Router(); 
const User = require("../models/User.model"); 
const bcrypt = require("bcryptjs"); 

router.get("/signup", (req, res, next) => {
    res.render("signup");
})

router.post("/signup", (req, res, next) => {
    const { username, password } = req.body 
    console.log(username, password)
    // validation 
    if (password.length < 6) {
        res.render("signup", { message: "Password has to be 6 chars min"}) 
        return 
    }
    // is username empty 
    if (username === '') {
        res.render("signup", {message: "Username cannot be empty!"})
        return 
    }
    // validation passed 
    // check if that username already exists 
    User.findOne({ username: username})
        .then(userFromDB => {
            // if there is a user 
            if (userFromDB !== null) {
                res.render("signup", { message: "Your username is already taken"})
                return
            } else {
                // can use that username, hash the password
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)
                console.log(hash)
                // create the user 
                User.create({ username: username, password: hash})
                    .then(createdUser => {
                        console.log(createdUser)
                        res.redirect("/")
                    })
                    .catch(err => {
                        next(err)
                    });
            }
        });
})

router.get("/login", (req, res, next) => {
    res.render("login");
})

router.post("/login", (req, res, next) => {
    const { username, password } = req.body; 

    User.findOne({ username: username })
        .then((userFromDB) => { 
            if (userFromDB === null) {
                res.render("login", { message: "Credentials are Invalid"});
                return
            }
            if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB; 
                res.redirect("main");
            }
        });
})

module.exports = router;