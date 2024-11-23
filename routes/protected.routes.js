// routes/protected.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// GET /main
router.get('/main', authMiddleware, (req, res) => {
  res.render('main', { user: req.session.user });
});

// GET /private
router.get('/private', authMiddleware, (req, res) => {
  res.render('private', { user: req.session.user });
});

module.exports = router;
