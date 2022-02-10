const { post } = require(".");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.js")

/* GET home page */
router.get("/sign-up", (req, res, next) => {
    res.render("sign-up");
});

router.get("/log-in", (req, res, next) => {
    res.render("log-in");
})


// Iteration 1 | Sign Up
router.post("/sign-up", (req, res, next) => {
    const { username, password } = req.body;
    //Bonus-Validation during the signup process-handle validation errors
    //the password must be min 4 chars
    if (password.length < 4) {
        res.render("sign-up", { message: "Your password should contains minimum 4 characters" })
        return;
    }
    //the username can"t be empty
    if (username.length === 0) {
        res.render("sign-up", { message: "Your username can not be empty" })
        return;
    }

    //The username can"t be repeated-do we already have a user with that username in the db? --> yes, send a message
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render("sign-up", { message: "This Username is already taken" })
            } else {
                //we can use that username and hash the password
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)

                //create a user
                User.create({ username: username, password: hash })
                    .then(createdUser => {
                        console.log(createdUser)
                        res.redirect("/log-in")
                    })
                    .catch(err => next(err))
            }
        })


});

//  Iteration 2 | Login/ Authentication
router.post("/log-in", (req, res, next) => {
    const { username, password } = req.body
        //check if we have the username in database
    User.findOne({ username: username })
        .then(userfromDB => {
            console.log("User: ", userfromDB)
                //the username does not exit
            if (userfromDB === null) {
                res.render("log-in", { message: "The entered username does not exit. Please try again!" })
                return;
            }
            //the username exits -> check the password with hashed password from DB
            //if the passwords are matched -> credentials are correct -> we log the user in
            if (bcrypt.compareSync(password, userfromDB.password)) {
                console.log("authenticated")
                    //req.session.<som key(normally user)>
                req.session.user = userfromDB
                console.log(req.session)
                    //redirect to the customer"s profile page
                res.redirect("/private");
            }

        })
})

router.get("/log-out", (req, res, next) => {
    //to log the user out, we destroy the session
    req.session.destroy()
    res.render("index")
})


module.exports = router;