const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model.js')


router.get("/signup", (req, res, next) => {
    res.render("signup");
});


router.get('/login', (req, res, next) => {
	res.render('login')
});


router.post("/signup", (req, res, next) => {
    const { username, password } = req.body
    if (username.length === 0) {
		res.render('signup', { message: 'You need a username' })
		return
    }

    // after vallidation I should verify if I got a user with that username in DB
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render("signup", { message: "That username is already taken"})
            } else {
                // using that username
                // and hash the password
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)
                
                //create the user
                User.create({ username, password: hash })
                    .then(createdUser => {
                        res.redirect("/login")
                    })
                    .catch(err => next(err))
            }
        })

});


router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    // check if exists a user with that username
    User.findOne({ username: username })
        .then(userFromDB => {
            console.log('user: ', userFromDB)
            if (userFromDB === null) {
                // this user does not exist
                res.render('login', { message: 'This user does not exist' })
                return
            }
            // if username is correct
            // check the password against the hash in DB
                            // password from User  vs.  password in DB
            if (bcrypt.compareSync(password, userFromDB.password)) {
                //console.log('here the error please')
                // it matches above -> this means that the credentials are correct
                // req.session.<some key (normally 'user'>)
                req.session.user = userFromDB
                // redirect to the profile page
                res.redirect('/profile')
            }
        })
});

router.get('/profile', (req, res, next) => {
    res.render('profile')
});




module.exports = router;

