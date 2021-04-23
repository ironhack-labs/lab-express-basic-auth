const express = require('express');

const router = express.Router();

// router.get('/profile', (req, res) => {
//   const { user } = req.session;
//   res.status(200).render("auth/profile", user);
// });

router.get('/main', (req, res, next) => res.render('auth/main'));
router.get('/private', (req, res, next) => res.render('auth/private'));


module.exports = router;