const router = require("express").Router();
const { isLoggedIn } = require('../middlewares/route-guard')
const Operas = require("../models/Opera.model");

router.get('/operas', (req, res, next) => {
    Operas
        .find()
        .sort({ title: 1 })
        .then(operas => res.render('operas/operas', { operas }))
        .catch(err => console.log(err))
});

router.get('/operas/create', isLoggedIn, (req, res, next) => {
    res.render('operas/new-opera')
});


router.post('/operas/create', isLoggedIn, (req, res, next) => {
    const { title, composer, image } = req.body

    Operas
        .create({ title, composer, image })
        .then(newOpera => res.redirect('/operas'))
        .catch(err => console.log(err))
});

module.exports = router