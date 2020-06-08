const {
    Router
} = require('express');
const router = Router();

/* GET home page */
router.get('/', (req, res, next) =>
    res.render('index', {
        logged: req.session.logged,
        userId: req.session.userId,
    })
);

module.exports = router;