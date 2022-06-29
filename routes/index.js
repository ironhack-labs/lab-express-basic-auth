const router = require("express").Router();

const loginCheck = () => {
  return (req, res, next) => {
      if (req.session.user !== undefined){
          next()
      } else {
          res.redirect("/signup")
      }
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", loginCheck(), (req, res, next) => {
  res.render("main");
});

module.exports = router;
