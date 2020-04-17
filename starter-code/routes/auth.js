const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const User = require('../models/user-model')

const bcryptSalt = 10

//---------------------REGISTRO-----------------------//

router.get('/signup', (req, res, next) => res.render('auth-views/signup')) 

//Info que llega del form

router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    //Se comprueba que los campos no estén vacíos

    if (!username || !password) {
        res.render('auth-views/signup', { errorMsg: '<p>All the fields must be filled</p>' })
        return
    }

    //Se comprueba que el user no está cogido

    User.findOne({ username })
        .then(userFound => {
            if (userFound) {
                res.render('auth-views/signup', { errorMsg: `<p>The username ${userFound.username} is already taken</p>` })
                return
            }

            //Se encripta el password

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPassword = bcrypt.hashSync(password, salt)

            // Se añade el nuevo user a la base de datos

            User.create({ username, password: hashPassword })
                .then(newUser => res.redirect('/'))
                .catch(err => console.log(`An error ocurred: ${err}`))
        })
        .catch(err => console.log(`An error ocurred: ${err}`))
})

//---------------------LOGIN-----------------------//

router.get('/login', (req, res, next) => res.render('auth-views/login'))

//Recibimos datos de formulario

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('auth-views/login', { errorMsg: '<p>All the fields must be filled</p>' })
        return
    }

    User.findOne({ username })
        .then(userFound => {
            if (!userFound) {
                res.render('auth-views/login', {errorMsg: `<p>The user ${username} does not exist</p>`})
                return
            }

            if (!bcrypt.compareSync(password, userFound.password)) {
                res.render('auth-views/login', { errorMsg: `<p>The password is not correct</p>` })
                return
            } 

            req.session.currentUser = userFound

            res.redirect('/')     
        })

        .catch(err => console.log(`An error ocurred: ${err}`))    
    
})

module.exports = router;

