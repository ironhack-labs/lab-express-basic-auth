const express = require("express");
const router = express.Router();
const {
  loginProcess,
  loginView,
  logout,
  mainView,
  privateView,
  signupProcess,
  signupView
} = require("../controllers/index");

const checkSession = require("../middlewares/checkSession");
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", checkSession, mainView);
router.get("/private", checkSession, privateView);

router.get("/signup", signupView);
router.post("/signup", signupProcess);

router.get("/login", loginView);
router.post("/login", loginProcess);

router.get("/logout", logout);
module.exports = router;
