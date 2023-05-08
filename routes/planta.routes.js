const express = require('express')
const router = express.Router()

const Plant = require('../models/Planta.model')
const { isLoggedIn } = require('../middlewares/route-guards')


router.get('/list', (req, res, next) => {

    Plant
        .find()
        .then(planta => {
            res.render('plantas/planta-lista', {planta})
            console.log({planta})
        })

        .catch(err => console.log(err))


})

router.get('/create', isLoggedIn, (req, res, next) => {

    res.render('plantas/planta-crear')
})

router.post('/create', isLoggedIn, (req, res, next) => {

    const { name, specie, imageURL } = req.body

    Plant
        .create({ name, specie, imageURL })
        .then(newPlanta => res.redirect('/plant/list'))
        .catch(err => console.log(err))
})

module.exports = router