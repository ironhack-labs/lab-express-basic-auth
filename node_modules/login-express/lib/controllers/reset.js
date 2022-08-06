/**
 * Module dependencies.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendMail = require('../helper/sendMail');
const User = require('../models/User');

exports.sendResetLink =
  (
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
  ) =>
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });
      // check if user exists
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'User with this email does not exist.' }],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, jwtResetSecret, {
        expiresIn: jwtResetExpiration, // in seconds
      });

      const defaultLink = `<h4><a href="https://${req.headers.host}/reset-password/${token}">Reset Password</a></h4>`;
      const defaultMessage = `
    <div style="margin: auto; width: 40%; padding: 10px">
      <h2>Password Assistance</h2>
      <p>To authenticate, please click on the Reset Password link below. It will expire in ${Math.floor(
        jwtResetExpiration / 60
      )} minutes.</p>
      ${defaultLink}
      <p>Do not share this link with anyone. We take your account security very seriously. We will never ask you to disclose or verify your password, OTP, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link. Instead, notify us immediately and share the email with us for investigation.</p>
      <p>We hope to see you again soon.</p>	
    </div>
  `;
      const defaultSubjectLine = 'Reset Password Request';

      return user.updateOne({ resetToken: token }).then(
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
          return res.json({
            msg: 'Password reset link has been sent to your email address. Please follow the instructions.',
          });
        },
        () => {
          return res
            .status(400)
            .json({ msg: { error: 'Reset password link error.' } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

exports.updatePassword = (jwtResetSecret) => async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // sent from client-side
  const { resetToken, newPassword } = req.body;

  if (!resetToken) {
    return res.status(401).json({ msg: { error: 'Authentication Error.' } });
  }

  try {
    jwt.verify(resetToken, jwtResetSecret, async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          msg: { error: 'Token has either expired or is invalid.' },
        });
      } else {
        User.findOne({ resetToken: resetToken }).then(
          async (user) => {
            // encrypt password: convert text password to a hash value
            const salt = await bcrypt.genSalt(10);

            // saving hashed password to user object
            user.password = await bcrypt.hash(newPassword, salt);
            user.resetToken = '';

            // save user object in mongodb
            // this returns a promise from which we can grab 'id'
            // note: mongoose abstracts '_id' to 'id'
            user.save().then(
              () => {
                return res.json({
                  msg: 'Your password has been reset. Please login with your new password.',
                });
              },
              () => {
                return res.status(400).json({
                  msg: { error: 'Password was not reset. Server error.' },
                });
              }
            );
          },
          () => {
            return res.status(400).json({
              msg: { error: 'Token has either expired or is invalid.' },
            });
          }
        );
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(401).send('Server Error');
  }
};
