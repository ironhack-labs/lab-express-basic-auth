// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();
 
// GET route ==> to display the signup form to users

router.get("/signup", (req, res) => res.render("auth/signup"));
 
// POST route ==> to process form data
 
module.exports = router;