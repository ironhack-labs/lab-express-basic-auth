const router = require("express").Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10

const { isLoggedOut } = require('./../middlewares/route-guard')

router.get("/registro", isLoggedOut, (req, res, next) => {
    // console.log('conected')
    // res.send("conected")
    res.render('auth/signup')
})


router.get("/inicio-sesion", isLoggedOut, (req, res, next) => {
    // res.send("conected")
    res.render('auth/login')
})


router.get('/cierre-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/inicio-sesion'))
})


router.post("/registro", isLoggedOut, (req, res, next) => {
    // res.send("conected")
    const {username, password, email} = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then(hashedPw => {
            return User.create({username, password:hashedPw, email})
        })
        .then(() => {
            res.redirect('/inicio-sesion')
        })
        .catch(err => {
            console.log(err)
            if (err.code === 11000) {
                res.render('auth/signup', {errorMessage: 'Usuario no disponible'})
            }
        })
})


router.post("/inicio-sesion", isLoggedOut, (req, res, next) => {
    // res.send("conected")
    const { username, password } = req.body
    
    User
        .findOne({ username })
        .then(user => {
        
            if (!user) {
                res.render('auth/login', { errorMessage: 'Usuario o contraseña incorrectos' })
                return
            }

            if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Usuario o contraseña incorrectos' })                
                return                
            }
            
            req.session.currentUser = user
            // const invisible = document.querySelector('.invisible')
            // invisible.classList.remove('.invisible')
            res.redirect('/')
        })
        .catch(err => console.log(err))
});



module.exports = router;
