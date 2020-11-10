const express = require('express');
const router = express.Router();
const User = require("../models/User.model.js")
const bcrypt = require("bcryptjs");

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get("/signup", (req, res, next) => {
    res.render("signup")
})

router.post("/signup", (req, res, next) => {

    const salt = bcrypt.genSaltSync(10);
    const pwHash = bcrypt.hashSync(req.body.password, salt);

    User.create({ username: req.body.username, password: pwHash}).then(() => {
        res.redirect("/")
    })
})

module.exports = router;



    router.post('/signup', (req, res) => {
    
      const salt = bcrypt.genSaltSync(10);
      const pwHash = bcrypt.hashSync(req.body.password, salt);
    
      User.create({ username: req.body.username, passwordHash: pwHash }).then(() => {
        res.redirect('/')
      })
    
    })