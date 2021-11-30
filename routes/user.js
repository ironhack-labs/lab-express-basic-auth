const router = require("express").Router();

const User = requirerequire('../middleware/route-guard');

const {isLoggedIn} = require()


/*GET PRIVATE => THE USER IS ALREADY CREATED */

router.get("/private", isLoggedIn, (req,res,next) => {
  res.render("private")
})


/*GET MAIN => THE USER IS ALREADY CREATED */

router.get("/main", isLoggedIn, (req,res,next) => {
  res.render("main")
})


module.exports = router;
