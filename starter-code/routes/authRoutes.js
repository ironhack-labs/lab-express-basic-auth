const router = require('express').Router()
const {singUpView, signupPost} =   require('../controllers/authControllers')


router.get("/signup", singUpView)
router.post("/signup", signupPost)



module.exports = router