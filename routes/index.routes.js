const express = require('express');
const router = express.Router();

/* GET home page */
//router.get("/", (req, res, next) => res.render("index"));
//example can use session anywhere req res
router.get("/", (req, res, next) => res.render("index", {user: req.session.currentUser}));

module.exports = router;
