const express = require('express');
const AWS = require("aws-sdk");
const keys = process.env.KEYID;
const SECRETKEY = process.env.SECRETKEY;
const uuid = require("uuid/v1");
const middleWare = require("./auth")
const router = express.Router();