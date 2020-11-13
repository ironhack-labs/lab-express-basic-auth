const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


//Main Endpoints
router.use((req, res, next) => req.session.currentUser ? next () : res.render('login/login', { errorMsg: 'Area Privada' })) 
router.get('/main', (req, res) => res.render('main', req.session.currentUser ))

//Private Endpoints
router.get('/private', (req, res) => res.render('private', req.session.currentUser))


module.exports = router
