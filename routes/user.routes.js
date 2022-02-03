// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
// all your routes here
router.get('/user/signup', (req, res, next) => res.render('user/user-signup'));

router.post('/user/signup', (req, res, next) => {

    const { username, password } = req.body;
 
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => User.create({username,password: hashedPassword}))
        .then(userFromDB => {
            console.log('Newly created user is: ', userFromDB);
            res.json(userFromDB);
        })
        .catch(error => next(error));

});

module.exports = router;