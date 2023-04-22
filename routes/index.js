const router = require("express").Router();
const isLoggedIn = require("../middlewares/isLoggedIn")
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use("/auth",require("./auth.routes"))

router.get("/profile", isLoggedIn, (req,res)=>{
  res.render("profile",{userEmail: req.session.user.email})
})

router.get("/main", isLoggedIn, (req,res)=>{
  res.render("main")
})

router.get("/private", isLoggedIn, (req,res)=>{
  res.render("private")
})
module.exports = router;
