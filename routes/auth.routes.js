const router = require("express").Router();
const User = require('./../models/User.model')
const bcryptjs = require('bcryptjs');
const saltRounds = 10
const { isLoggedOut } = require('./../middeleware/route-guard')


// Sign up
router.get("/registro", isLoggedOut, (req, res, next) => {
    res.render("auth/signup");
});

router.post('/registro', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body
    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/login', { errorMessage: "The username ya existed,please login" })
                return
            }

            bcryptjs
                .genSalt(saltRounds)
                .then(salt => bcryptjs.hash(password, salt))
                .then(hashedPassword => User.create({ username, password: hashedPassword }))
                .then(() => res.redirect('/inicio-sesion'))
                .catch(err => console.log("There is a problem with you Sigin up", err))
        })
})

//Login
router.get('/inicio-sesion', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body
    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: "The username doesn't exist,check it be careful" })
                return
            }
            if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login', { errorMessage: "The password is not correct" })
                return
            }
            req.session.currentUser = user
            res.redirect('/mi-perfil')
        })
})




//logout
router.get('/cierre-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/inicio-sesion'))
})


module.exports = router;