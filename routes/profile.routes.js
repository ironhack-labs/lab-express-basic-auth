const router = require("express").Router()
const isLoggedIn = require('../middlewares/isLoggedIn');
const isAdmin =  require('../middlewares/isAdmin');
const isPrivate = require('../middlewares/isPrivate');
const isMain = require('../middlewares/isMain');
/**
 * This router is prefixed with /profile
 */
router.get("/", isLoggedIn, (req, res) => {
	res.render("profile");
});

router.get('/admin',isAdmin, (req, res, next)=>{
	res.send("This is the admin page");
});

router.get("/private", isPrivate, (req, res, next) =>{
res.render("private");
});

router.get("/main", isMain, (req, res, next) =>{
	res.render("main");
	});

module.exports = router;
