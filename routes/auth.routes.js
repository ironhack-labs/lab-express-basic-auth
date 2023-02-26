const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');

const User = require('../models/User.model');
const saltRounds = 10;

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });

router.get('/signup', (req, res) => res.render('auth/signup'));


router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;


try {

    let hash = await bcryptjs.genSalt(saltRounds)
    let hashedPassword = await bcryptjs.hash(password, hash)
    let user = await User.create({
        username,
        passwordHash: hashedPassword
    })
    res.redirect('/userProfile')


} catch (error) {
    next(error)

}
})

router.get('/login', (req,res,next)=> {

    try {
        res.render('auth/login')
    } catch (error) {
        console.log("Error with LOGIN GET", error)
        next(error)
    }
})

router.post('/login', async (req,res, next) => {
    console.log('SESSION ====>', req.session)

    const { username, password } = req.body


    try {

        if (username === '' || password === '') {
            res.render('auth/login', {
                errorMessage: 'Please enter both username and password to login.'
            });
            return;
        }

        const findUser = await User.findOne({ username })

            if (!findUser) {
                res.render('auth/login', { errorMessage: 'Username is not registered.' });
                return;
            } else if (bcryptjs.compareSync(password, findUser.passwordHash)) {
                req.session.currentUser = findUser;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }




    } catch (error) {
        console.log("The error is with LOGIN POST", error)
        next(error)
    }
})

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Error with the logout POST");
            next(err)
        }
        res.redirect('/')
    })
})









module.exports = router;
