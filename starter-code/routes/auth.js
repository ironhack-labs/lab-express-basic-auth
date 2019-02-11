let router = require('express').Router()
let User = require('../models/User')
let bcrypt = require('bcrypt')

router.post('/signup', (req, res, next)=>{
	if (req.body.password !== req.body.password2) {
		return res.render('user/signup', {...req.body, errors:{password: "Wrong Password"}})
	}
	let salt = bcrypt.genSaltSync(5)
	req.body.password = bcrytp.hashSync(req.body.password, salt)
	User.create(req.body)
			.then(()=>res.redirect('/profile'))
			.catch(e=>next(e))
})

router.get('/signup' (req, res, next)=>{
 res.render('user/signup')
})

module.exports = router