const router = require("express").Router();
const {isLoggedIn,isLoggedOut} = require('../utils/route-guard') //<== middelware
const User = require("../models/User.model")
const {checkRole} = require("../utils/check-role")
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
// luego la usaremos
router.get("/profile", isLoggedOut, (req, res, next) => {
  //mi usuario se encuentra guardado en el req.session.currentUser

  console.log("req.",req.session)
 res.render('private/profile',{user: req.session.currentUser })
})

router.get("/noAuth",(req,res,next)=>{
  res.render("noAuth")
})


router.get("/list-user",isLoggedOut, checkRole(["ADMIN"]), async (req,res,next)=>{
    try{
       const listUser = await User.find({},"username email role")
       console.log("listUSer",listUser)
       res.render("private/list-user",{listUser})
    }catch(error){
      console.log("error",error)
      res.redirect("/")
    }
})
module.exports = router;