const app = require('../app');
const isLogged = require('../middleware/is_logged.middleware')
const router = require('express').Router();

router.get('/', isLogged, (req, res, next) => {
    if (isLogged) {
        console.log(req.session.user)
        res.render('private-page', req.session.user)
    }
})

module.exports = router