const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
    res.render('home');
})


//comprobamos login de usuario y si no lo esta lo redirigimos
router.use((req, res, next) => {
    console.log('llego al chequeo del usuario');
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/login');
    }
});



router.get("/main", (req, res, next) => {
    const { username } = req.session.currentUser
    res.render("main", { username });
});

router.get("/private", (req, res, next) => {
    const { username } = req.session.currentUser
    res.render("private", { username });
});


module.exports = router;