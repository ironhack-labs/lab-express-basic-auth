const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/user.model')

// Registro
router.get('/', (req, res, next) => res.render('index'))
router.post('/', (req, res, next) => {
	const { user, password } = req.body

	// Validaciones: campos vacíos
	if (user === '' || password === '') {
		res.render('index', { errorMessage: 'Rellena todo' })
		return // En caso de no pasar la validación, abandona la función sin crear el usuario ni el hash
	}

	// Validaciones: email duplicado
	User.findOne({ user: user })
		.then(elm => {
			if (elm) {
				console.log(elm)
				res.render('index', { errorMessage: 'El user ya existe' })
				return
			}
		})
		.catch(err => console.log('ERRORR:', err))

	const salt = bcrypt.genSaltSync(bcryptSalt)
	const hashPass = bcrypt.hashSync(password, salt)

	User.create({ user, password: hashPass })
		.then(() => {
			res.redirect('/login')
		})
		.catch(err => console.log('ERRORR:', err))
})

// Iniciar sesión
router.get('/login', (req, res, next) => res.render('login'))
router.post('/login', (req, res, next) => {
	const { user, password } = req.body

	if (user === '' || password === '') {
		res.render('login', { errorMessage: 'Rellena todo.' })
		return
	}

	User.findOne({ user })
		.then(elm => {
			console.log(req.session)
			console.log(password)
			if (!elm) {
				res.render('login', { errorMessage: 'El usuario no existe.' })
				return
			}
			if (bcrypt.compareSync(password, elm.password)) {
				req.session.currentUser = elm // Guarda el usuario en la sesión actual
				res.redirect('/')
			} else {
				res.render('login', { errorMessage: 'Contraseña incorrecta' })
			}
		})
		.catch(error => next(error))
})

router.use((req, res, next) => {
	req.session.currentUser ? next() : res.render('login', { errorMessage: 'Inicia sesión para acceder al area privada' })
})

router.get('/main', (req, res, next) => res.render('main'))

router.get('/main2', (req, res, next) => res.render('main2'))

// Cerrar sesión
router.get('/logout', (req, res, next) => {
	req.session.destroy(err => res.redirect('/login'))
})

module.exports = router
