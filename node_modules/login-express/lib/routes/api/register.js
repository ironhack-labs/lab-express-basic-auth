/**
 * Module dependencies.
 */

const { body } = require('express-validator');
const { signUpUser } = require('../../controllers/register');

exports = module.exports = registerUser;

function registerUser(
  jwtSecret,
  passwordLength,
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
  // @route  POST api/users
  // @desc   Register user
  // @access Public >> access private routes after auth successful
  router.post(
    '/',
    [
      body('name', 'Name is required.').not().isEmpty(),
      body('email', 'Please include a valid email.').isEmail(),
      body(
        'password',
        `Please enter a password with ${passwordLength} or more characters.`
      ).isLength({ min: passwordLength }),
    ],
    signUpUser(
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
