const express = require("express");
const router = express.Router();
const { logoutFunc } = require("../controllers/logout");

router.post("/", logoutFunc);

module.exports = router;
