/**
 * Module dependencies.
 */

const auth = require('../../middleware/auth');
const { body } = require('express-validator');
const { getLoginUserInfo, signInUser } = require('../../controllers/login');

exports = module.exports = loginUser;

function loginUser(
  jwtSecret,
  jwtSessionExpiration,
  emailFromUser,
  emailFromPass,
  emailHeading,
  emailSubjectLine,
  emailHost,
  emailPort,
  emailSecure,
  emailMessage,
  express
) {
  const router = express.Router();
  // @route  GET api/auth
  // @desc   Get auth user
  // @access Private
  router.get('/', auth, getLoginUserInfo);

  // @route   POST api/auth
  // @desc    Login user
  // @access  Public >> access private routes after auth successful
  // user logs in with email and password
  router.post(
    '/',
    [
      body('email', 'Please provide a valid email.').isEmail(),
      body('password', 'Password is required.').exists(),
    ],
    signInUser(
      jwtSecret,
      jwtSessionExpiration,
      emailFromUser,
      emailFromPass,
      emailHeading,
      emailSubjectLine,
      emailHost,
      emailPort,
      emailSecure,
      emailMessage
    )
  );

  return (module.exports = router);
}
