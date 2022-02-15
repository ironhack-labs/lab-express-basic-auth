const async = require("hbs/lib/async");
const User = require('../models/User.model');
const router = require("express").Router();
const bcrypt = require('bcryptjs');

/* GET home page */
router.post("/signin", async (req, res, next) => {
    const { username , password } = req.body;
    try {
        const resDB = await User.find({ username: username });
        bcrypt.compareSync(password, resDB[0].password) ? res.redirect("/home") : res.redirect("/?error=true");
    } catch (err) {
        console.log("Error while retrieving a user: ", err);
        res.redirect("/?error=true");
    }
});

module.exports = router;