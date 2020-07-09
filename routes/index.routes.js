const express = require('express')
const router = express.Router()
const User = require('../models/User.model.js')

/* GET home page */
router.get('/', (req, res, next) => res.render('index') )

router.get('/signup', (req, res, next) => res.render('signup') )

router.post('/signup', (req, res, next) => {
    User.create(req.body)
      .then(user => {
        res.render('index', {user})
      })
      .catch((e) => {
          console.log(e)
      })  
    })

module.exports = router
