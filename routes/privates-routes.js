const router = require("express").Router();
const loggedIn = require("../middleware/loggedIn")

router.get('/main',loggedIn , (req, res, next) => {
    res.render('user/main', {userDetails: req.session.currentUser})
})

router.get('/privates', loggedIn, (req,res, next ) => {
    res.render('user/privates', {userDetails: req.session.currentUser})
})


module.exports = router;