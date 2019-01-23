const express = require('express');
const router = express.Router();
const usersRouter = require('../controllers/users.controller');
const secure = require('../middlewares/secure.mid');


router.get('/main', secure.isAuthenticated, usersRouter.main);
router.get('/private', secure.isAuthenticated, usersRouter.private);

module.exports = router;