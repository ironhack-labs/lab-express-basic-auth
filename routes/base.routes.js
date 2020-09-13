const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'))


router.use((req, res, next)=>{
    if (req.session.currentUser) {
        next()
    } else {
        res.render('login-form', { errorMessage: 'Inicia sesión para acceder...' })
    }
})


router.get('/main', (req, res) => res.render('main'))
router.get('/private', (req, res) => res.render('private', req.session.currentUser))


module.exports = router;
