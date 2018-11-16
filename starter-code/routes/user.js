const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const mongoose     = require('mongoose');

router.use(session({
	secret:"basic-auth-secret",
	cookie:{ maxAge:60000},
	store: new MongoStore({
	  mongooseConnection:mongoose.connection,
	  ttl:24*60*60
	})
  }));
/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/personalPage', (req, res, next) => {
	res.render('personalPage');
});

router.post('/personalPage', function (req, res) {
	const saltRounds = 5;

	const {user, password} = req.body;

	if (user === "" || password === "") {
		res.render("index", {
		  errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	  }

	console.log(user, password);
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);

	const newUser = new User({
		user,
		password:hash
	})

	newUser.save()
	.then(user => {
		req.session.inSession = true
		console.log(req.session)
		console.log(user)
		res.redirect("/user/personalPage")
	})
})

router.get('/personalPage/main', (req, res, next) => {
	res.render('main');
});


router.get('/personalPage/private', (req, res, next) => {
	res.render('private');
});
router.post('/personalPage/private', (req, res) => {
	User.findOne({
	  user: req.body.user,
	}).then((found) => {
	  const matches = bcrypt.compareSync(req.body.password, found.password);
  
	  if (matches) {
		req.session.inSession = true;
		req.session.user = req.body.user;
  
		res.redirect('private');
	  } else {
		req.session.inSession = false;
		res.redirect('main');
	  }
	});
  });
module.exports = router;
