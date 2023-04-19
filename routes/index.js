const router = require("express").Router();
const User = require("..models/User.model")
const bcrypt = require("bcryptjs") 

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/auth/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/auth/signup", (req, res, next) => {
const { username, password} = req.body

});

module.exports = router;
