const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')

const saltRounds = 10

router.get('/sign-up', (req, res) => {
	res.render('auth/signup-form')
})

router.post('/sign-up', (req, res, next) => {
	const { username, plainPassword } = req.body

	bcrypt
		.genSalt(saltRounds)
		.then(salt => bcrypt.hash(plainPassword, salt))
		.then(hash => User.create({ username, password: hash }))
		.then(() => res.redirect('login'))
		.catch(error => next(error))
})

router.get('/login', (req, res) => {
	res.render('auth/login-form')
})

router.post('/login', (req, res, next) => {
	const { username, password } = req.body

	if (username.length === 0 || password.length === 0) {
		res.render('auth/login-form', { errorMsg: 'Introduzca todos los datos' })
		return
	}

	User.findOne({ username })
		.then(userFound => {
			if (!userFound) {
				res.render('auth/login-form', {
					errorUserMsg: 'No existe ninguna cuenta con ese nombre de usuario',
				})
				return
			}

			if (!bcrypt.compareSync(password, userFound.password)) {
				res.render('auth/login-form', { errorPassMsg: 'La contraseña no es correcta' })
				return
			}
			req.session.currentUser = userFound
			res.render('index', { layout: 'layouts/logedIn-layout', user: userFound })
		})
		.catch(err => next(err))
})

router.get('/log-out', (req, res) => {
	req.session.destroy(() => res.redirect('/'))
})

module.exports = router
