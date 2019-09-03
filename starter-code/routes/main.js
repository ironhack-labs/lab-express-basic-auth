const express = require("express");
	const router = express.Router();
	const UserMOdel = require("./../models/user");
	
	/* GET home page */
	router.get("/", (req, res, next) => {
	  if (req.session.currentUser) {
	    res.render("auth/main");
	  } else {
	    res.redirect("auth/login");
	  }
	});
	module.exports = router;