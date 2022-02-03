const express = require('express');
const router = express.Router();


const common = require('../controllers/common.controller');
const auth = require('../controllers/auth.controller');


// COMMON routes //
// home page , the route comes from APP.JS => app.use('/', routes);
router.get('/', common.home);

// AUTH  routes
// register page, the route comes from NAVBAR.HBS link in the navbar
router.get('/register', auth.register)

// register page SUBMIT FORM  the route comes from the submit Button  <form method="POST" action="/register">
router.post('/register', auth.doRegister)


module.exports = router;