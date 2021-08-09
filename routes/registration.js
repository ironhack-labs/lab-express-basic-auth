const router = require("express").Router();

const User = require("../models/User.model")

const bcrypt = require('bcryptjs');
const saltRounds = 10

/* GET home page */
router.get("/register", (req, res, next) => {
    res.render("users/user-registration")
});

router.post("/register", (req, res, next) => {
    console.log("User input:", req.body)
    //storing the userinput 
    const { username, password } = req.body

    // creating the according data in db, but using the encrypted version:
    //generate salt
    const salt = bcrypt.genSaltSync(saltRounds)
    //create a hashed version of the password:
    const hash1 = bcrypt.hashSync(password, salt)
    User.create({username: username, password: hash1})
        .then(() => {
            res.send("user created")
        })
})


module.exports = router;
