const router = require('express').Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model');

const displaySingup = (req, res) => res.render("auth/singup");

router.get("/singup", displaySingup);

router.post("/singup", async (req, res) => {
    const { username, password } = req.body;

    if(!password || !username) {
        const errorMessage = 'Your password or username are not valid';
        res.render("auth/singup", {errorMessage});
        return
    }
    try {
      const foundUser = await User.findOne({ username });
        if (foundUser) {
            const errorMessage = 'You are already registered!'
            res.render("auth/singup", { errorMessage });
            return
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        const creatdeUser = await User.create({
            username,
            password: hashedPassword
        })
        res.redirect("/profile");
    } catch(error){
        console.log(error);
    }
});

module.exports = router;