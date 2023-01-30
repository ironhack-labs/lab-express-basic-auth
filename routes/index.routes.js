const router = require("express").Router();
const indexController = require('../controllers/index.controller')

/* GET home page */
router.get("/", indexController.home);

module.exports = router;
