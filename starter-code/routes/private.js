const express 	   = require("express");
const privateRoutes       = express.Router();

privateRoutes.get('/welcome',(req, res, next) => {
    res.render('welcome');
});

module.exports = privateRoutes;
