const express = require('express');
const router = express.Router();
const User = require("../models/User.model")


const bcryptjs = require('bcryptjs');
const saltRounds = 10;

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res) => res.render('../views/auth/signup'));

router.post('/signup', async (req, res) => {
    console.log(req.body);

    const {username, password} = req.body;

    try {
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt);
        
        console.log('Hashed password => ', hashedPassword);

        const result = await User.create({username, passwordHash: hashedPassword})

        res.redirect('/signup');
        console.log(result);

    } catch (err) {
        console.error(err);
    }
});


module.exports = router;
