const express = require("express");
const router = express.Router();
const isLoggedIn = require("../helpers/isLoggedIn");

// Check if user is logged before all routes
router.use(isLoggedIn)

router.get("/",(req,res,next)=>{
  res.render("main/index");
})

module.exports = router;