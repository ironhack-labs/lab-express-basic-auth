const router = require('express').Router()
const {singUpView, signupPost, loginView, loginPost,isLogged,profile} =   require('../controllers/authControllers')


router.get('/signup', singUpView)
router.post('/signup', signupPost)

router.get('/login', loginView)
router.post('/login', loginPost)
module.exports = router