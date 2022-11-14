const router = require("express").Router();
const { isLoggedIn } = require('./../middleware/route-guard')
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});



router.get('/mi-perfil',isLoggedIn, (req, res, next) => {
    res.render('user/perfil',{ user: req.session.currentUser })
})

module.exports = router;
