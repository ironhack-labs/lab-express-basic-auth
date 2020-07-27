const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('home'));



// verificamos si el usuario tiene una session activa, de ser así, lo redirigimos a la siguiente ruta, en este caso
// /secret
// en caso contrario, redirigimos al usuario a /login
router.use((req, res, next) => {
    if (req.session.currentUser) { //<---si hay un usuario en la sesion(user is logged in)
        next();//----->go to next route(main y private)
    } else {
        res.redirect('/login')
    }
});

// renderizamos las plantillas secretas main.hbs y private.hbs con el username
// deconstruimos en la variable username el username de req.session.currentUser
router.get('/main', (req, res, next) => {
    res.render('main');
});

router.get('/private', (req, res, next) => {
    res.render('private');
});


router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});

module.exports = router;

