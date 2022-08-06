/**
 * Module dependencies.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendMail = require('../helper/sendMail');
const User = require('../models/User');

exports.getLoginUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
};

exports.signInUser =
  (
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
  ) =>
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      // check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      // check if password entered at login matches what's stored in db
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      let token = jwt.sign(payload, jwtSecret, {
        expiresIn: jwtSessionExpiration, // in seconds
      });

      const defaultLink = `<h4><a href="https://${req.headers.host}/verify-email/${token}">Verify Email Address</a></h4>`;
      const defaultMessage = `
      <div style="margin: auto; width: 40%; padding: 10px">
        <h2>Email Verification Request</h2>
        <p>To verify your email address so you can continue to use your account, click the following link:</p>
        ${defaultLink}
        <p>Thanks for joining the community.</p>	
      </div>
    `;
      const defaultSubjectLine = 'Please Verify Your Email Address';

      if (!user.verifyEmail) {
        return user.updateOne({ verifyEmailToken: token }).then(
          () => {
            sendMail(
              email,
              defaultLink,
              defaultMessage,
              defaultSubjectLine,
              emailFromUser,
              emailFromPass,
              emailHeading,
              emailSubjectLine,
              emailHost,
              emailPort,
              emailSecure,
              emailMessage
            );
            return res.json({ token });
          },
          () => {
            return res
              .status(400)
              .json({ msg: { error: 'Email verification link error.' } });
          }
        );
      } else {
        return res.json({ token });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
