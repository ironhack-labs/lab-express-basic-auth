const express = require("express");
const router = express.Router();
const { loadLoginPage, logInUser } = require("../controllers/login");

router.get("/", loadLoginPage);
router.post("/", logInUser);

module.exports = router;
