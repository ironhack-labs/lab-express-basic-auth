const router = require("express").Router();

const common = require('../controllers/common.controller');
const auth = require('../controllers/auth.controller');

//Common routes
router.get("/", common.home);

//User registration routes
router.get('/register', auth.register);
router.post('/register', auth.doRegister);
/* router.get('/login', auth.login);
router.post('/login', auth.doLogin); */

module.exports = router;