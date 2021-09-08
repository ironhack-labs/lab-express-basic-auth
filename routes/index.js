const router = require("express").Router()
const {isLoggedIn , isLoggedOut} = require("../middleware/route-guard.js")

/* GET home page */
  router.get("/", (req, res, next) => {
  res.render("index");
});


/*MAIN*///////////////////////////////////////////////////////

router.get("/main" ,(req,res) =>{

  res.render("main")
})

/*PRIVATE*///////////////////////////////////////////////////////

router.get("/private" , isLoggedIn, (req,res) =>{

  res.render("private")
})
module.exports = router;
