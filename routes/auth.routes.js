const router = require('express').Router();
const User = require('../models/User.model')
const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs');
const UserModel = require('../models/User.model');
const saltRounds = 10

router.route('/signup')
    .get((req, res) => res.render('auth/signup'))
    .post((req, res, next) => {
        // console.log('The form data:', req.body)

        const {username, password} = req.body

        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

        if(!regex.test(password)){
            res
                .status(500)
                .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'})
        }
        
        if(!username || !password) {
            res.render('auth/signup', {errorMessage: 'All fields are mandatory, Please provide your username and password.'})
            return;
        }
        
        bcryptjs
            .genSalt(saltRounds)
            .then(salt => bcryptjs.hash(password, salt))
            .then(hashedPassword => {
                // console.log('Password hash:', hashedPassword)
                return User.create({username, passwordHash: hashedPassword})
            })
            .then(userFromDb => {
                console.log('Newly created user is:', userFromDb)
                res.redirect('/userProfile')
            })
            .catch(error => {
                if (error instanceof mongoose.Error.ValidationError) {
                  res.status(500).render('auth/signup', { errorMessage: error.message });
                } else if (error.code === 11000) {
                  res.status(500).render('auth/signup', {
                     errorMessage: 'Username need to be unique.'
                  });
                } else {
                  next(error);
                }
              });
        

    })

    router.route('/userProfile')
    .get((req, res) => res.render('users/user-profile', {userInSession: req.session.currentUser}))

    router.route('/login')
        .get((req, res) => res.render('auth/login'))
        .post((req, res, next) => {
            const { username, password } = req.body

            console.log('SESSION ====>', req.session)

            if(username === '' || password === ''){
                res.render('auth/login', {errorMessage: 'Please enter both, username and password to login'})
                return;
            }
            

            User.findOne({ username })
            .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other username.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user
                console.log(req.session)
                res.redirect('/userProfile')
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
            })
            .catch(error => next(error));
        })

        router.route('/private')
            .get((req, res) => {
            const user = req.session.currentUser
            if(!user){
                res.redirect("/login")
            }
            res.render('private', {userInSession: req.session.currentUser})
        })

        router.route('/main')
            .get((req, res) => {
            const user = req.session.currentUser
            if(!user){
                res.redirect("/login")
            }
            res.render('main', {userInSession: req.session.currentUser})
            })


        
module.exports = router;