const express = require('express');
const router = express.Router();

// Import user
const User = require('../models/User.model');



// Home GET
router.get('/', (req, res) => res.render('index', { title: 'App created with Ironhack generator 🚀' }));

// Signup GET -------------------------------------------------------------
router.get('/signup', (req, res) => res.render('auth/signup.hbs'));
// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
    // console.log("The form data: ", req.body);

    const { username, email, password } = req.body;
		
})

module.exports = router;