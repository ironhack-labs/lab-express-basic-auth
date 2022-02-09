const router = require("express").Router();




// middleware to protect a route
function loginCheck() {
	return (req, res, next) => {
		// check if exist a logged in user
		if (req.session.user) {
			// user is logged in
			next()
		} else {
			// user is not logged in
			res.redirect('/login')
		}
	}
}



router.get('/main', loginCheck(), (req, res, next) => {
	// set a coockie
	res.cookie('myCookie', 'hello')
	// access the cookie -> req.cookies
	console.log('coockie: ', req.coockies)
	// cleat the cookie on the client
	res.clearCookie('myCookie')
	const user = req.session.user
	res.render('main', {user: user}); 
});

router.get('/private', loginCheck(), (req, res, next) => {
	// set a coockie
	res.cookie('myCookie', 'hello')
	// access the cookie -> req.cookies
	console.log('cookie: ', req.cookies)
	// cleat the cookie on the client
	res.clearCookie('myCookie')
	const user = req.session.user
	res.render('private', {user: user}); 
});



module.exports = router;