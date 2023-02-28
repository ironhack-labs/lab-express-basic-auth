const { Router } = require('express');
const router = new Router();
const authMiddleware = require('../middleware/route-guard');

router.get('/private', authMiddleware, (req, res) => res.render('private'));

module.exports = router;