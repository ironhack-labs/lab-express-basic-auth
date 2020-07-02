const express = require("express");
const router = express.Router();

const checkSession = (req, res, next) => {
    const user = req.session.user;

    return user ? next() : res.redirect('/login')
}
module.exports = checkSession