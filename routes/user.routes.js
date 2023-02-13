const router = require("express").Router();



const { isLoggedIn } = require('../middlewares/route-guard')






router.get("/perfil", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser });
});


router.get('/principal', isLoggedIn, (req, res, nex) => {
    res.render('user/main', { user: req.session.currentUser })
})


module.exports = router;
