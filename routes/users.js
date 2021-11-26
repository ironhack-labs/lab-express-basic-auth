const express = require("express");
const router = express();
const usersController = require("./../controllers/usersController");
const routeGuard = require("./../middlewares/route-guard");

router.get("/main", routeGuard.usuarioLoggeado, usersController.profile);
router.get("/private", routeGuard.usuarioLoggeado, usersController.private);

module.exports = router;
