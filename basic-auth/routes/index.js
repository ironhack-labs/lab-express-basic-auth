const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const bcryptSalt = 2;

router.get('/', (req, res, next) => {
	res.render('index');
})

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})

router.post('/signup', (req, res, next) => {
	const {username, password} = req.body;

	User.findOne({username})
	.then(user => {
		if(user !== null) throw new Error('Username Already Exist')
		
		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(password, salt);

		const newUser = new User({
			username,
			password: hashPass
		})

		return newUser.save();
	})
	.then(user => {
		res.redirect('/');
	})
	.catch(err => {
		console.error(err);
		res.render('auth/signup', {errorMessage: err.message});
	})
})

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
	const {username, password} = req.body;

    new Promise((resolve, reject) => {
		if(username === "" || password === ""){
			throw new Error("Require username and password");
			return;
		}
		resolve();
	})
	.then(() => {
		return User.findOne({username});
	})
	.then(user => {
		if(!user) throw new Error('Username doest exist');
		if(!bcrypt.compareSync(password, user.password)) throw new Error('Incorrect password')

		req.session.currentUser = user;
		console.log(`Logged as ${user.username}`);
		res.redirect('/');
	})
	.catch(err => {
		// console.error(err);
		res.render('auth/login', {errorMessage: err.message});
	})
})


router.get('/main', (req, res, next) => {
	if(req.session.currentUser) res.render('private/main');
	else res.redirect('/');
})

router.get('/private', (req, res, next) => {
	if(req.session.currentUser) res.render('private/private');
	else res.redirect('/');
})

router.get('/logout',(req,res)=>{
	req.session.currentUser=null;
	res.redirect('/');
})

module.exports = router;