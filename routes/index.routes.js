const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcrypt')
const session    = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose   = require ('mongoose')

const User = require('../models/User.model')

router.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
}));

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/sign-up', (req, res, next) => {
    res.render('signup')
})

router.post('/sign-up', (req, res, next) => {

    const {username, password} = req.body

    User.findOne({username: username})
    .then((result) => {
        if(!result) {
            bcrypt.genSalt(10)
            .then((salt) => {
                bcrypt.hash(password, salt)
                .then((hashedPassword) => {
                    const hashedUser = {username: username, password: hashedPassword} //se puede poner {email, password: ''} porque el key y el value son iguales
                    User.create(hashedUser)
                    .then(() => {
                        res.redirect('/')
                    })
                })
            })
            .catch((error) => {
                res.send(error)
            })
        
        } else {
            res.render('login', {errorMessage: 'This user already exists.'})
        }
    })
})

router.get('/log-in', (req, res, next) => {
    res.render('login')
})

router.post('/log-in', (req, res, next) => {
    const {username, password} = req.body

    User.findOne({username: username})
    .then ((result) => {
        if(!result) {
            res.render('login', {errorMessage: `This user doesn't exist`})
        } else {
            bcrypt.compare(password, result.password)
            .then((resultFromBcrypt) => {
                if(resultFromBcrypt) {
                    req.session.currentUser = username
                    res.redirect('/')
                } else {
                    res.render('login', {errorMessage: 'Wrong password, please try again.'})
                }
            })
        }
    })
})

router.get('/log-out', (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})

router.use((req, res, next) => {
    if(req.session.currentUser){
        next();
    } else {
        res.redirect('/log-in')
    }
})

router.get('/main', (req, res, next) => {
    res.render('main')
})

router.get('/private', (req, res, next) => {
    res.render('private')
})

module.exports = router;
