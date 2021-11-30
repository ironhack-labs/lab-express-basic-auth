const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});



/*GET PRIVATE => THE USER IS ALREADY CREATED */

router.get("/private", (req,res,next) => {
  res.render("private")
})


/*GET MAIN => THE USER IS ALREADY CREATED */

router.get("/main", (req,res,next) => {
  res.render("main")
})


module.exports = router;
