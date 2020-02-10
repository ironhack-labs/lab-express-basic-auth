const express = require('express');
const router  = express.Router();

router.get("/private", (req, res) => res.render("private/private"))

module.exports = router;

