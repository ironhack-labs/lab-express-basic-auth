var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);


//Route Sign-up
router.get("/signup", (req,res)=>{
  console.log("No");
 res.render("signup-form");
});






module.exports = router;