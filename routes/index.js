const express = require("express");
const router = express();
const indexController = require("./../controllers/indexController");
/* GET home page */
router.get("/", indexController.home);

module.exports = router;
