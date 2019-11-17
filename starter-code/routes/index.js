const express = require("express");
const router = express.Router();

const {
  signupView,
  signupProcess,
  loginView,
  loginProcess,
  privateView,
  logout,
  mainView,
  
} = require("../controllers/authUser");

const checkSession = require("../middlewares/checkSession")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", signupView)
router.post("/signup", signupProcess)

//login

router.get("/login", loginView);
router.post("/login", loginProcess);


router.get("/private", checkSession, privateView)
router.get("/main", checkSession, mainView);
router.get ("/logout", logout)


module.exports = router;