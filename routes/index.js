const router = require("express").Router();

//middleware to check if the user is logged in

const loginCheck = () => {
  return (req, res, next) => {
    //is there a logged in user
    if (req.session.user) {
      //proceeed
      next();
    } else {
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', loginCheck(), (req, res, nex) => {
  res.render('profile', {user: req.session.user});
})

module.exports = router;
