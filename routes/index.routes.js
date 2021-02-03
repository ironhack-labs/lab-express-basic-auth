const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/User.model")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.post('/register', (req, res, next) => {
    
    /*User.create(req.body)
        .then(() => {
            res.redirect('/')
            })
        .catch(e => {
            res.send(e.errors)
            })
    */
    function renderWithErrors(errors) {
        res.status(400).render('../views/register', {
        errors: errors,
        user: req.body
        })
    }

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        renderWithErrors({
          username: 'Username already exist. Try with a different one.'
        })
      } else {
        User.create(req.body)
          .then(() => {
            res.redirect('/')
          })
          .catch(e => {
            if (e instanceof mongoose.Error.ValidationError) {
              renderWithErrors(e.errors)
            } else {
              next(e)
            }
          })
      }
    })
    .catch(e => next(e))
 
});

router.get('/register', (req, res, next) => res.render('register'));

router.get('/login', (req, res, next) => res.render('login'));

module.exports = router;
