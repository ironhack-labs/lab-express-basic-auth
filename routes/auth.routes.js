const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRound = 10

const { isLoggedOut } = require('./../middleware/route-guard') //profile
const User = require('../models/User.model')

//SINGUP: GET Y POST QUE VAN A VIEWS SINGUP => 

router.get('/registrate', (req, res) => {
    res.render('auth/registrate')
})

router.post('/registrate', (req, res, next) => {

    const { username, plainPassword } = req.body

    bcryptjs
        .genSalt(saltRound)
        .then(salt => bcryptjs.hash(plainPassword, salt)
            .then(hashedPassword => User.create({ username, password: hashedPassword }))
            .then(() => res.redirect('/inicio-sesion'))
            .catch(error => next(error))

        )
})


//LOGIN: GET Y POST QUE VAN A VIEWS => LOGIN 


router.get('/inicio-sesion', (req, res) => {
    res.render('auth/inicio-sesion')
})

router.post('/inicio-sesion', (req, res, next) => {

    const { username, plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/inicio-sesion', { errorMessage: 'Rellena todos los campos' })
        return
    }


    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/inicio-sesion', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/inicio-sesion', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user          // <= THIS means logging in a user
            res.redirect('user/profile')
        })
        .catch(error => next(error));


})

//LOG OUT

router.post('/cerrar-sesion', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))

})

module.exports = router 