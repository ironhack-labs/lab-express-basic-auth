const express = require("express");
const router = express.Router();
const { getHomeRoute, postHomeRoute } = require("../controllers/index");

/* GET home page */
router.get("/", getHomeRoute);

router.post("/", postHomeRoute);

module.exports = router;
