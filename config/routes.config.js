const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', (req, res, next) => res.send('Roxana'))

// Auth
router.get(
  '/signup',
  authMiddleware.isNotAuthenticated,
  authController.signup
);
router.post('/signup', authController.doSignup)

module.exports = router;
