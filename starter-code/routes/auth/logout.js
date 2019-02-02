const express = require('express');
const router  = express.Router();

router.get('/', (req, res, next) => {
   req.session.destroy(() => {
    res.redirect('/signin');
   });
}) 

module.exports = router;