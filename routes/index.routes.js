const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

//IT 3
//Middleware (puente de acceso) para que solo pasen los que tienen session activa
//El código de debajo de este middleware solo es accesible si hay session activa
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/login');
    }
});

//IT 3
//Si hay session, enseña este router.get que renderiza private.hbs
router.get('/private', function (req, res, next) {
    res.render('private.hbs');
});

//IT 3
//Si hay session, enseña este router.get que renderiza main.hbs
router.get('/main', function (req, res, next) {
    res.render('main.hbs')
})

module.exports = router;