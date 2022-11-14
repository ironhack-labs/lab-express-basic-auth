const { isLoggedin } = require("../middleware/route-safe");

const router = require("express").Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get('/mi-perfil', isLoggedin, (req, res) => {
  res.render('user/perfil', { user: req.session.currentUser })
})

module.exports = router;
