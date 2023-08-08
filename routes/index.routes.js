const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { loggedUser: req.session.currentUser })
})

module.exports = router
