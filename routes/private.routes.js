const express = require("express");
const router = express.Router();
const { getPrivate } = require("../controllers/private");

router.get("/", getPrivate);

module.exports = router;
