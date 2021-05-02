const express = require('express');
const router = express.Router();

router.get('/user-profile', (req, res) => {
    const { user } = req.session;
    res.status(200).render('users/user-profile', { user });
});

router.get('/main', (req, res, next) => res.status(200).render('users/main'));
router.get('/private', (req, res, next) => res.status(200).render('users/private'));

module.exports = router;