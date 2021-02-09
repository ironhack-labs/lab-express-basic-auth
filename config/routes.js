const express = require("express");
const router = require("express").Router();
const miscController = require('../controllers/misc.controller')
const usersController = require('../controllers/users.controller')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');
router.get('/', miscController.home)

//==========================USERS==================================
//get muestra la pagina y post trae el usuario se sumaaaan 

router.get('/register', (req, res) => res.render('users/register'));

router.post('/register', (req, res, next) => {
    const { email, password } = req.body;
    
 
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
            email,
            // passwordHash => this is the key from the User model
            //     ^
            //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
            passwordHash: hashedPassword,
        })
        .then((userFromDB) => {
            console.log('Newly created user is: ', userFromDB);
    })
      .catch((error) => next(error));
    })
})

router.get('/summit', (req, res) => res.render('users/userProfile'));





module.exports = router;
