const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const sendMail = require('../helper/sendMail');
const User = require('../models/User');

exports.signUpUser =
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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists.' }] });
      }

      // get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // create a new instance of user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt password: convert text password to a hash value
      const salt = await bcrypt.genSalt(10);

      // saving hashed password to user object
      user.password = await bcrypt.hash(password, salt);

      // save user object in mongodb
      // this returns a promise from which we can grab 'id'
      // note: mongoose abstracts '_id' to 'id'
      await user.save();

      // create payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      // sign the token with payload and secret
      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: jwtSessionExpiration, // in seconds
      });

      const protocol =
        process.env.NODE_ENV === 'development' ? 'http://' : 'https://';
      const defaultLink = `<h4><a href="${protocol}${req.headers.host}/verify-email/${token}">Verify Email Address</a></h4>`;
      const defaultMessage = `
      <div style="margin: auto; width: 40%; padding: 10px">
        <h2>Email Verification Request</h2>
        <p>To verify your email address so you can continue to use your account, click the following link:</p>
        ${defaultLink}
        <p>Thanks for joining the community.</p>	
      </div>
    `;
      const defaultSubjectLine = 'Please Verify Your Email Address';

      return user
        .updateOne({ verifyEmail: false, verifyEmailToken: token })
        .then(
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
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
