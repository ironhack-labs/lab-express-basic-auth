// 5000 is not always available, enviroment variable to solve this issue

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config() 
}

const express = require('express');
const app = express(); // app server 
const bcrypt = require('bcrypt') 
const passport = require('passport') 
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override') 

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = [] 

app.use(express.static(__dirname + '/Views'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(express.json()); // add a peace of middleware 

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
   res.render('login.ejs') 
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword 
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
    })

    app.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    })

    app.get('/porsche', checkAuthenticated, (req, res) => {
        res.render('porscheProject.ejs') 
     })

     app.get('/mercedes', checkAuthenticated, (req, res) => {
        res.render('mercedes.ejs') 
     })

     app.get('/berlinTu', checkAuthenticated, (req, res) => {
        res.render('berlinTu.ejs') 
     })


function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))  