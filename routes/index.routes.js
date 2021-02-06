const express = require('express')
const router = express.Router()

/* GET home page */
router.get('/', (req, res) => res.render('index'))

// router.use((req, res, next) => {
//     console.log(req.session)
//     if (req.session.currentUser) {
//         next()
//     }
//     else {
//         res.render('login-form', { errorMsg: 'Desautorizado, iniciar sesión antes' })
//     }
// })


 
router.get('/perfil', (req, res) => {
    const theUser = req.session.currentUser
    // console.log(req.session.currentUser)
    res.render('profile', theUser)
})


module.exports = router;
