const express = require("express");
const router = express.Router();
const { getSignup, postSignup, getLogin, postLogin } = require("../controllers/auth.controllers");

router.get("/signup", getSignup);
router.post("/signup", postSignup);

router.get("/login", getLogin);
router.post("/login", postLogin);

module.exports = router;
