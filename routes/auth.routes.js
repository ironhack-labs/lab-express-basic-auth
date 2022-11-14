const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10
const User = require('../models/User.model')
const { loggedIn, loggedOut } = require('../middleware/route-guard')



router.get("/register", loggedOut, (req, res, next) => {
    res.render("auth/sign-up");
});
router.post("/register", loggedOut, (req, res, next) => {

    const { username, password } = req.body



    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then(hashedPwd => {
            return User.create({ username, password: hashedPwd })
        })
        .then(() => {
            res.redirect('/log-in')

        })
        .catch(err => res.redirect('/register'))



});


router.get('/log-in', loggedOut, (req, res, next) => {
    res.render('auth/log-in')
})

router.post('/log-in', loggedOut, (req, res, next) => {

    const { username, password } = req.body

    User
        .findOne({ username })
        .then(user => {
            console.log(user)
            if (!user) {
                res.render('auth/log-in', { errorMesage: 'User name not recognized' })
                return
            }

            console.log(user.password)

            if (!bcryptjs.compareSync(password, user.password)) {
                res.render('auth/log-in', { errorMessage: 'Incorrect password' })
                return
            }
            req.session.currentUser = user
            res.redirect('/user/main')
        })
        .catch(err => console.log(err))

})

router.get('/user/main', loggedIn, (req, res, next) => {
    res.render('user/main', { user: req.session.currentUser })
})

router.get('/user/private', loggedIn, (req, res, next) => {
    res.render('user/private', { user: req.session.currentUser })
})


module.exports = router;
