const router = require('express').Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

// Middleware
router.use((req, res, next) => {
  console.log(req.session.currentUser)
  if (req.session.currentUser) {
    next()
  } else {
    res.render('auth/login', {
      errorMessage: 'You need to be logged to visit this website',
    })
  }
})

// Rutas protegidas
router.get('/main', (req, res) => {
  res.render('main-page', req.session.currentUser)
})

router.get('/private', (req, res) => {
  res.render('private-page', req.session.currentUser)
})

module.exports = router
