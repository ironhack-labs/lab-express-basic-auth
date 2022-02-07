const router = require("express").Router();

const indexCtrl = require('./../controllers/index.controller')

/* GET home page */
router.get("/", indexCtrl.getHome);

module.exports = router;
