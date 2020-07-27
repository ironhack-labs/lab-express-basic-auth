const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// On vérifie que le user a une session active. Si c'est le cas, on le dirige à la route suivante "/secret"
// Si ce n'est pas le cas, on le redirige à "/login"
router.use((req, res, next) => {
    //S'il y a un utilisateur connecté à sa session (logged in)
    if (req.session.currentUser) {
        //Go à la prochaine route
        next();
    } else {
        res.redirect('/login');
    }
});

router.get('/private', function (req, res, next) {
    res.render('private');
});

router.get('/main', function (req, res, next) {
    res.render('main');
});

module.exports = router;