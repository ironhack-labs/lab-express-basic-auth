const express = require('express')
const router = express.Router()

router.get('/private', (req, res, next) => res.render('private'))


router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render("private", { errorMsg: "Inicia para ver el contenido oculto"})
})

router.get('/private', (req, res, next) => res.render('private'))

module.exports = router