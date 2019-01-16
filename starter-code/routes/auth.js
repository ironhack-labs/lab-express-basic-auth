const express     = require("express");
const router      = express.router();

const bcrypt      = require("bcrypt");
const saltRounds  = 10;
