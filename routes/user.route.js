const router = require("express").Router()
const {isLoggedIn,isLoggedOut} = require("../middleware/auth.middleware")
const { route } = require("./login.route")

router.get("/main", isLoggedIn ,(req,res)=>{
    const {username} = req.session.currentUser

    res.render("main",{username})
})
router.get("/private",isLoggedIn,(req,res)=>{
    res.render("private")
})
router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });
module.exports = router
 