const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    const loggedUser = req.session.user;
    res.render('index', { user: loggedUser });
});

const loginCheck = (req, res, next) => {
    console.log(req.session)
    if (req.session.user){
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/main', loginCheck(), (req, res) => {
    res.render('main')
})

router.get('/private', loginCheck(), (req, res) => {
    res.render('private')
})

module.exports = router;