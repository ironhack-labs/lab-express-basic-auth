//1. IMPORT
const router = require("express").Router();

const indexController = require("./../controllers/index.Controller")



//2. Rutas de BASE URL
/* GET home page */
router.get("/", indexController.home);


module.exports = router;
