const Router = require('express').Router;
const router = Router();


router.get('/', (req, res, next) => {
    res.render('index', {
      title : 'Home',
      loggedUser : req.session.currentUser
    });
});







module.exports = router;
