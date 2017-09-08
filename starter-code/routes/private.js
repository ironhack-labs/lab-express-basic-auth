const express 	   = require("express");
const privateRoutes       = express.Router();

privateRoutes.get('/private',(req, res, next) => {
    res.render('private');
});

module.exports = privateRoutes;
