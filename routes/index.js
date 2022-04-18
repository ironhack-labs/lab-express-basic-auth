const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//Establecer la ruta del auth
router.use('/', require('./auth.routes.js'))

//Establecer la ruta del user
router.use('/', require('./user.routes.js'))


module.exports = router;
