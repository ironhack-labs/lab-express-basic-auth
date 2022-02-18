const async = require("hbs/lib/async");
const User = require('../models/User.model');
const router = require("express").Router();
const bcrypt = require('bcryptjs');

const { isLoggedOut } = require('../middleware/route-guard');


/* GET home page */
router.post("/signin", isLoggedOut, async (req, res, next) => {
    const { username , password } = req.body;
    try {
        const resDB = await User.find({ username: username });
        if (bcrypt.compareSync(password, resDB[0].password)){
            req.session.currentUser = resDB;
            res.redirect("/home");
        } else {
            res.redirect("/?error=true");
        }
    } catch (err) {
        console.log("Error while retrieving a user: ", err);
        res.redirect("/?error=true");
    }
});

module.exports = router;