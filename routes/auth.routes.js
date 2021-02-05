const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


// // Custom middleware
// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//         next()
//     }
//     else {
//         res.render('auth/login-form', { errorMsg: 'Desautorizado, iniciar sesión antes' })
//     }
// })

// router.get('/perfil', (req, res) => res.render('profile'))


module.exports = router