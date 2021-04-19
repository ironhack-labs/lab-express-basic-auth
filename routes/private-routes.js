const express = require('express');
const router = express.Router();

// Middleware to handle user in session. If user in session continue else redirect to login page
function isLoggedIn(req, res, next) {
    if (req.session.currentUser) next();
    else res.redirect('/auth/login')
}
router.get('/profile', isLoggedIn, (req, res) => {
    // Render profile view and pass the user in session object
    res.render('profile', { user: req.session.currentUser });
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('main', { user: req.session.currentUser });
})

module.exports = router;