const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

/* GET signup page */
router.get("/", (req, res) => {
  res.render("auth/signup");
});

router.post("/", (req, res) => {
    const {username, email, password} = req.body;
    bcrypt.genSalt(saltRounds)
    .then((salt) => {
        return bcrypt.hash(password, salt);
    })
    .then((hash) => {
        return User.create({username, email, pwHash: hash});
    })
    .then(() => {
        res.send("User successfully created!");
    })
    .catch((err) => {
        console.log("There was an error creating the account: ", err);
    });
});

module.exports = router;
