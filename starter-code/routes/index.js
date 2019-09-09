const express = require("express");
const {
  getLoginForm,
  createUser,
  findUser,
  getSignupForm,
  getPrivate,
  isLoggedin,
  getMain
} = require("./../controllers/index.controller");
const router = express.Router();

/* GET home page */
router.get("/", getSignupForm);
router.get("/signup", getSignupForm);
router.post("/signup", createUser);
router.get("/login", getLoginForm);
router.post("/login", findUser);
router.get("/private", isLoggedin, getPrivate);
router.get("/main", isLoggedin, getMain);

module.exports = router;
