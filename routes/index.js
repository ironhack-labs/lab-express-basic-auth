const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', isLoggedIn, (req,res,next)=>{
  res.render('main');
});

router.get('/private', isLoggedIn, (req,res,next)=>{
  res.render('private');
})

module.exports = router;
