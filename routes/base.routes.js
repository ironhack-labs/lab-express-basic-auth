const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


router.use((req, res, next) => {
    if(req.session.currentUser){
        next()
    }else{
        res.render('login-form', {errorMessage : "Inicia sesión para acceder a tu perfil"})
    }

})

router.get('/main', (req, res) => res.render('main-page', req.session.currentUser))
router.get('/private', (req,res) => res.render('private-perro'))



module.exports = router
