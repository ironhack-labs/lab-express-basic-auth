const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    const loggedinUser = req.session.user;
    console.log({loggedinUser});
    res.render('index', {user: loggedinUser})
});

const loginCheck = () => {
    return (req, res, next) => {
        if(req.session.user) {
            next();
        } else {
            res.redirect('/login')
        }
    }
}

router.get('/private', loginCheck(), (req, res, next) => {
    res.render('private')
})

router.get('/main', loginCheck(), (req, res, next) => {
    res.render('main')
})

module.exports = router;
