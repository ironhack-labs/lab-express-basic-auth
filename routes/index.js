const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup",(req, res)=>{
  res.render('signup')
})

router.get("/signup",(req, res)=>{
  //const {email, password} = req.body

  console.log(email, password)
})

module.exports = router;
