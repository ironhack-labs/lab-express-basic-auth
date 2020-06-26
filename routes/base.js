const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render("/login", { errorMsg: 'Área restringida! >_<' })
    }
})


router.get("/perfil", (req, res) => {
    res.render('profile', req.session.currentUser)
});


module.exports = router;
