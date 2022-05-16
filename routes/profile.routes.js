const router =  require('express').Router;

router.get('/profile', (req, res) => {
    //console.log('req.session.currentUser in profile route', req.session.currentUser);
    res.render('profile');
});

module.exports = router;