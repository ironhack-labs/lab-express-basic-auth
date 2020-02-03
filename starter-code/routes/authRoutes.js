const router = require('express').Router()

const {signUpView, signUp, loginView, login} = require('../controllers/controller')
// const { isLoggedIn } = require('../middlewares/index')

router.get('/sign-up', signUpView)
router.post('/sign-up', signUp)
router.get('/login', loginView)
router.get('/login', login)



module.exports = router
