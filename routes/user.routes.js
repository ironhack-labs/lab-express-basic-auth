const express = require('express');
const router = express.Router();

router.get("/perfil", (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})

module.exports = router