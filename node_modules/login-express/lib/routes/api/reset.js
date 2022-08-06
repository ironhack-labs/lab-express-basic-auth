/**
 * Module dependencies.
 */

const { body } = require('express-validator');
const { sendResetLink, updatePassword } = require('../../controllers/reset');

exports = module.exports = resetPassword;

function resetPassword(
  jwtResetSecret,
  jwtResetExpiration,
  passwordLength,
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
  // @route  PUT api/forgot-password
  // @desc   Get auth user & send reset link to user email
  // @access Public

  const router = express.Router();
  router.put(
    '/',
    [body('email', 'Please include a valid email.').isEmail()],
    sendResetLink(
      jwtResetSecret,
      jwtResetExpiration,
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

  // @route   PATCH api/reset-password
  // @desc    Reset Password
  // @access  Public >> access private routes after auth successful
  // user logs in with email and password
  router.patch(
    '/',
    [
      body(
        'newPassword',
        `Please enter a password with ${passwordLength} or more characters.`
      ).isLength({ min: passwordLength }),
    ],
    updatePassword(jwtResetSecret)
  );

  return (module.exports = router);
}
