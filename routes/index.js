const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', loginCheck(), (req, res, next) => {
  res.cookie('myCookie', 'hello server')
  const loggedInUser = req.session.user
  res.render('main', { user: loggedInUser })
});

router.get('/private', loginCheck(), (req, res, next) => {
  res.cookie('myCookie', 'hello server')
  const loggedInUser = req.session.user
  res.render('private', { user: loggedInUser })
});

function loginCheck () {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      // if the user is logged in they can proceed as requested
      next()
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/logout', (req, res, next) => {
	req.session.destroy((err => {
		if (err) {
			next(err)
		} else {
			// success - we don't have an error
			res.redirect('/')
		}
	}))
});

module.exports = router;
