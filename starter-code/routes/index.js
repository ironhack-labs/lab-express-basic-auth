const express = require("express");
const router = express.Router();
const { getHome, getMain, getPrivate } = require("../controllers/site.controllers");

function checkSession(req, res, next) {
  if ( req.session.currentUser) next();
	else res.redirect("/auth/login");
}

router.get("/", getHome);

router.get("/main", checkSession, getMain);

router.get("/private", checkSession, getPrivate);

module.exports = router;
