const { Router } = require('express');
const router = new Router();

router.get('/main', (req, res) => res.render('main'));

module.exports = router;