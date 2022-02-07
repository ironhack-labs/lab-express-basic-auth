const res = require("express/lib/response")
const bcryptjs = require('bcryptjs')

const router = require("express").Router()

router.get("/perfil", (req, res, next) => res.render("profile/profile"))

module.exports = router;