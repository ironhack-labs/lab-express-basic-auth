const express = require("express");
const router = express();
const usersController = require("./../controllers/usersController");

router.get("/main", usersController.profile);
router.get("/private", usersController.private);

module.exports = router;
