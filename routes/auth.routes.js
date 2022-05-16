const router = require('express').Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model');

const displaySingup = (req, res) => res.render("auth/singup");
//*function to render singup view

router.get("/singup", displaySingup);
//*calling render function

router.post("/singup", async (req, res) => {
    const { username, password } = req.body;

    if(!password || !username) {
        const errorMessage = 'Your password or username are not valid';
        res.render("auth/singup", {errorMessage});
        return
        //*display error message if theres no password or no username.
    }
    try {
      const foundUser = await User.findOne({ username }); //*check if user exist in db
        if (foundUser) {
            const errorMessage = 'You are already registered!'
            res.render("auth/singup", { errorMessage });
            return
            //*display error message if the user is already registered in db.
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        const createdUser = await User.create({
            username,
            password: hashedPassword
        })
        res.redirect("/profile");
    } catch(error){
        console.log(error);
    }
});

module.exports = router;