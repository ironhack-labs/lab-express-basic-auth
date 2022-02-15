const async = require("hbs/lib/async");
const User = require('../models/User.model');
const router = require("express").Router();
const bcrypt = require('bcryptjs');

/* GET home page */
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post("/signup", async (req, res, next) => {
    const { username , password } = req.body; 
    const salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);
    try {
        const resDB = await User.create({ username , password: hash });
        console.log(resDB);
        res.redirect("/");
    } catch (err) {
        console.log("Error while creating a user: ", err);
        res.redirect("/signup?error=true");
    }
});

module.exports = router;
