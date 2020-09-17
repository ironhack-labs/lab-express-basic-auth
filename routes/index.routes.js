const express = require('express');
const router = express.Router();
const UserModel = require("../models/User.model")
const saltRounds = 10
const bcrypt = require("bcryptjs")

/* GET home page */ 
router.get('/', (req, res, next) => res.render('index'));

// GET sign up page
router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', async (req, res) => {
    console.log(req.body)
    const {username, email, password} = req.body
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Hashed password => ', hashedPassword);

        const result = await UserModel.create({ username, email, passwordHash: hashedPassword });

        res.redirect('/');

        console.log(result);
    } catch (err) {
        console.error(err);
    }
})









module.exports = router;