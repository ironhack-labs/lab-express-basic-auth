const async = require("hbs/lib/async");
const User = require('../models/User.model');
const router = require("express").Router();
const bcrypt = require('bcryptjs');

const { isLoggedOut } = require('../middleware/route-guard');

/* GET home page */
router.get("/signup", isLoggedOut, (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
    const { username , password } = req.body; 
   
    try { 
        const salt = bcrypt.genSaltSync(10);
        hash = await bcrypt.hashSync(password, salt);
        const resDB = await User.create({ username , password: hash });
        console.log(resDB);
        res.redirect("/");
    } catch (err) {
        console.log("Error while creating a user: ", err);
        res.redirect("/signup?error=true");
    }
});

module.exports = router;
