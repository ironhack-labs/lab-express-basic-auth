const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();
const User = require("../models/User.model")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

/* Register page */

router.get('/register', (req, res, next) => {
    res.render('register')
})

router.post('/register', (req, res, next) => {
    function renderWithErrors(errors) {
    res.status(400).render('register', {
      errors: errors,
      user: req.body
    })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    email: "Email already exists"
                })
            }
            else {
                User.create(req.body)
                    .then(() => {
                        //console.log(user)
                        res.redirect("/")
                    })
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithErrors(e.errors)
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch((e)=> next(e))
})

module.exports = router;
