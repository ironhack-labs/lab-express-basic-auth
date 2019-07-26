const express = require('express')
const router = express.Router()

router.get('/main', (req, res, next) => res.render('main'))


router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render("main", { errorMsg: "Inicia para ver el contenido oculto"})
})

router.get('/main', (req, res, next) => res.render('main'))

module.exports = router