const router = require("express").Router();
const {isLoggedIn} = require("../middleware/index");
const Room = require('../models/Room.model')


router.get('/rooms/create', (req, res, next) => {
	res.render('rooms/new-room')
});

router.post('/rooms', (req, res, next) => {
	const {name, price} = req.body
	
	const userId = req.session.user._id
	Room.create({ name, price, owner: userId })
		.then(newRoom => {
			res.redirect('/rooms')
		})
		.catch(error => {
			next(error)
		})
});

router.get('/rooms', isLoggedIn, (req, res, next) => {
	const userId = req.session.user._id
    const query = { }

    if (req.session.user.role === "user") {
        query.owner = req.session.user._id
    }

	Room.find(query)
	.populate("owner")
	.then(rooms => {
        console.log("rooms: ", rooms)
		res.render('rooms/index', { rooms })
	})
	.catch(error => {
		next(error)
	})
});

router.get('/rooms/:id/delete', (req, res, next) => {
    const roomId = req.params.id
	const query = { _id: roomId }

	if (req.session.user.role === 'user') {
		query.owner = req.session.user._id
	}
	console.log(query)

	Room.findOneAndDelete(query)
		.then(() => {
			res.redirect('/rooms')
		})
		.catch(error => {
			next(error)
		})
});


module.exports = router;