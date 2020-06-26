const express = require('express');
const router = express.Router();
const User = require('../models/User.model')

const session    = require("express-session");

const bcrypt = require('bcrypt');
const bcryptSalt = 10




/* GET home page */
router.get('/', (req, res, next) => res.render('index'));



/* GET sign-up */
router.get('/sign-up', (req, res) => {
    res.render("sign-up")
})

/* POST sign-up */
router.post('/sign-up', (req, res) => {

    const {username, password} = req.body

    if(username.length === 0||password.length===0) {
        
        res.render('sign-up', {errorMessage: 'Merluzo, rellena ambos campos!'})
        return
    }

    if (password.length<3){

        render.render('sign-up', {errorMessage: 'La contraseña tiene que ser mayor de 3 caracteres, merluzo!!'})
        return 

    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User
        .create( {username, password: hashPass} )
        .then (newUser => {
            console.log("Usuario creado", newUser)
            res.redirect('/')
        })
        .catch(err => console.log("Error", err))

})


/* GET log-in*/

router.get('/log-in', (req, res)=>{
    res.render('log-in')
})


/* POST log-in*/


router.post('/log-in', (req, res) =>{

    const {username, password} = req.body

    if(username.length === 0||password.length===0) {
        
        res.render('sign-up', {errorMessage: 'Merluzo, rellena ambos campos!'})
        return
    }

    User
        .findOne( {username} )
        .then (checkedUser => {
            
            if(!checkedUser) {
                res.render('log-in', {errorMessage: "Usuario no encontrado"})
                return
                
            }
            
            if (bcrypt.compareSync(password, checkedUser.password)) {

                req.session.currentUser = checkedUser
                console.log("El usuario es: ", req.session.currentUser )
                res.redirect('/')
            
            } else {

                res.render("log-in", {errorMessage: "Contraseña incorrecta"})
                return
            }
        })
        .catch(err => console.log("Error", err))


})

/* ruta publica */


router.get('/public', (req, res) => res.render('weje'))



/* Log-out*/

router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect("log-in"))
})

/*Checker validator*/
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else{
        res.render('log-in',  {errorMessage: 'No estás logueado, MERLUZO!'})
    }   

})


/*ruta privada */

router.get('/private', (req, res) => res.render('guau'))

module.exports = router;
