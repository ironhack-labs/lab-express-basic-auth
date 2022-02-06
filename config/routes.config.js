const express = require("express");
const router = express.Router();

const common = require('../controllers/common.controller');
const auth = require('../controllers/auth.controller'); // Requiere todo el contenido del archivo auth.controllter
const user = require('../controllers/user.controller');
const { isAuthenticated } = require('../middlewares/auth.middlewares');

// Misc routes
router.get('/', common.home);


// Rutas autenticación
router.get('/register', auth.register);
// auth = variable que requiere al archivo "auth.controllter" || register = nombre de la propidedad de uno de los módulos de "auth.controllter"
router.post('/register', auth.doRegister);
// cuando se va a la ruta "/register", se ejecuta todo lo que hay dentro del module.exports con la propiedad "doRegister" del archivo "auth.controllter" 
router.get('/login', auth.login);
router.post('/login', auth.doLogin);
router.get('/logout', auth.logout);


// Rutas de usuario
router.get('/profile', isAuthenticated, user.profile)
// Cuando se va a la ruta "profiles", se ejecuta la variable "isAuthenticated", que a su vez requiere el módulo "isAuthenticated" del archivo "auth.middlwares". Además, también se ejecuta el código del módulo "profile" del archivo "user.controller".

module.exports = router;