var express = require('express');
var router = express.Router();

// User model
const User = require("../models/user");

router.get('/', function (req, res, next) { 
    res.render('/index');
});