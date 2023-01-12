const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.model");
const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
    console.log(req.body);

    const {email, password} = req.body;

    bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
        console.log("LabSalt", salt);

        return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
        console.log("Hashed Password ", hashedPassword)
        return User.create({
            email: email,
            passwordHash: hashedPassword,
        })
})
    .then((result) => {
        console.log(result)
        res.redirect("/profile")
    })
    .catch((err) => {
        console.log(err)
    })
}) 

router.get("/profile", (req, res) => {
    res.render("user/user-profile")
  });

module.exports = router;
