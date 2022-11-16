const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route.guard");
const Tarot = require('../models/Tarot')

router.get('/tarots/add', (req, res, next) => {
	res.render('tarots/add')
});

router.post('/tarots', (req, res, next) => {
	const { name, price } = req.body
	// node basic auth: req.session.user 
	const userId = req.session.user._id
	Tarot.create({ name, price, owner: userId })
		.then(createdtarots => {
			res.redirect('/tarots')
		})
		.catch(err => {
			next(err)
		})
});

router.get('/tarots', isLoggedIn, (req, res, next) => {
	const userId = req.session.user._id

  const query = { }
  if (req.session.user.role === "user") {
    query.owner = req.session.user._id
  }

  Tarot.find(query)
	.populate("owner")
	.then(tarots => {
      console.log("tarots: ", tarots)
			res.render('tarots/index', { tarots })
		})
		.catch(err => {
			next(err)
		})
});

router.get('/tarots/:id/delete', (req, res, next) => {

	const tarotId = req.params.id

	const query = { _id: tarotId }

	if (req.session.user.role === 'user') {
		query.owner = req.session.user._id
	}
	console.log(query)
	Tarot.findOneAndDelete(query)
		.then(() => {
			res.redirect('/tarots')
		})
		.catch(err => {
			next(err)
		})
});


module.exports = router;