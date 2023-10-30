// routes/user.routes.js
const { Router } = require('express');
const router = new Router();

// require auth middleware
const { isLoggedIn } = require('../middleware/route-guard.js')

router.get('/user/profile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;