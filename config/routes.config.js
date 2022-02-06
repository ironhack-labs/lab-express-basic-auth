const express = require('express');
const router = express.Router();

// controllers folder
const common = require('../controllers/common.controller');
const auth = require('../controllers/auth.controller');
const user = require('../controllers/user.controller');
const { isAuthenticated } = require('../middlewares/auth.middlewares')



// -------  COMMON ROUTES ------- //
// home page , the route comes from APP.JS => app.use('/', routes);
router.get('/', common.home);

// -------  AUTH  ROUTES  ------- //
router.get('/register', auth.register)// the route comes from NAVBAR.HBS link in the navbar
router.post('/register', auth.doRegister)//the route comes from the submit Button 

router.get('/login', auth.login);// the route comes from NAVBAR.HBS link in the navbar
router.post('/login', auth.doLogin)// the route comes from the submit Button 

router.get('/logout', auth.logout)


// -------  USER  ROUTES  ------- //
router.get('/profile', isAuthenticated, user.profile)
router.get('/profile2', isAuthenticated, user.profile2)

router.get('/private', user.private)



module.exports = router;