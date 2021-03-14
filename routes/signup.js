const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/User.model');

router.get('/signup', async (req, res, next) => {
    try {
        await res.render('signup')
    } catch (err) {
        next(err)
    }
})

router.post('/signup', async (req, res, next) => {
    console.log("hello")
    try {
        const newUser = {... req.body};
        const foundUser = await UserModel.findOne({ username: newUser.username})

        if (foundUser) {
            console.log("User already in db")
            res.redirect('/login');
        } else {
            const hashedPassword = bcrypt.hashSync(newUser.password, 10);
			newUser.password = hashedPassword;
            const user = await UserModel.create(newUser);
            res.redirect('/login')
        }
    } catch(err) {
        console.log(err)
        next(err);
    }
})

module.exports = router;