const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


//verificamos si hay una sesión activa, si es así, lo redirigimos a la siguiente ruta ('/private)
//en caso contrario, redirigimos al usuario a /login

router.use((req, res, next) => {
    if (req.session.currentUser) { //si hay un usuario en la sesión es que está logeado
        next();
    } else {
        res.redirect('/login')
    }
});

//renderizamos la plantilla private.hbs con el username

router.get('/private', (req, res, next) => {
    res.render('private');
});

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/login')
    })
})




module.exports = router;