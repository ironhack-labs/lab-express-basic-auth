const { verifyEmail } = require('../../controllers/verify');

exports = module.exports = verifyUser;

function verifyUser(jwtSecret, express) {
  // @route  PATCH api/auth
  // @desc   Verify Email
  // @access Private
  const router = express.Router();
  router.patch(
    '/',
    verifyEmail(jwtSecret)
  );

  return (module.exports = router);
}
