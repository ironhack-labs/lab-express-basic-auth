const { Router } = require("express");
const router = new Router();

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

module.exports = router;
