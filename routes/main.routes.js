const express = require("express");
const app = require("../app");
const router = express.Router();
const { getMain } = require("../controllers/main");

router.get("/", getMain);

module.exports = router;
