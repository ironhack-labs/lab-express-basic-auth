const express = require('express');
const router  = express.Router();

router.get("/main", (req, res) => res.render("public/main"))

module.exports = router;

