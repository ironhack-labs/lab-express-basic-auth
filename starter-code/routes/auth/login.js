const express = require('express');
const router = express.Router();
const userModel = require("../../models/user")
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('login');
});

router.post('/', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (!username || !password) {
        res.render("login", {
            errorMessage: "Need a username and password to login"
        });
        return;
    }

    userModel.findOne({ username: username })
        .then(user => {
            if (!user) {
                res.redirect("signup", {
                    errorMessage: "This username doesn't exists"
                });
                return;
            }
            console.log(user)
            if (bcrypt.compareSync(password, user.password)) {
                // save the current session
                req.session.currentUser = user;
                console.log("MATCH")
                res.redirect('/')
            } else {
                console.log("NO MATCH")
                res.redirect('/login')
            }

        })
        .catch(err => {
            next(err)
            console.log(err)
        })
});


module.exports = router;