const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup",(req,res,next)=>{
  const{email,password} = req.body;
})



module.exports = router;