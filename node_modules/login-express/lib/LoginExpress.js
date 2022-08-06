const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('./helper/sendMail');

/**
 * Authentication Manager class.
 */
class LoginExpress {
  /**
   * Validate config object, initialize variables and connect to database.
   */
  constructor({
    jwtSecret,
    jwtResetSecret,
    emailFromUser,
    emailFromPass,
    emailHost,
    clientBaseUrl,
    userModel,
    emailPort = 465,
    emailSecure = true,
    verifyEmailHeading = '',
    verifyEmailSubjectLine = '',
    verifyEmailMessage = '',
    verifyEmailRedirect = '/verify-email',
    resetEmailHeading = '',
    resetEmailSubjectLine = '',
    resetEmailMessage = '',
    resetEmailRedirect = '/reset-password',
    passwordLength = 8,
    jwtSessionExpiration = 7200,
    jwtResetExpiration = 900,
  }) {
    // validate config
    if (!Number.isInteger(passwordLength) || !Number.isInteger(jwtSessionExpiration)) {
      throw new Error('"passwordLength" and "jwtSessionExpiration" must be positive integers.');
    }
    if (passwordLength < 0 || jwtSessionExpiration < 0) {
      throw new Error('"passwordLength" and "jwtSessionExpiration" must be positive integers.');
    }
    if (!jwtSecret || !jwtResetSecret || !emailFromUser || !emailFromPass || !emailHost || !clientBaseUrl || !userModel) {
      throw new Error(
        'Missing required config. Make sure you have the following in your config object: jwtSecret, jwtResetSecret, emailFromUser, emailFromPass, emailHost, mongoDbUri, clientBaseUrl'
      );
    }

    // assign class variables
    this.jwtSecret = jwtSecret;
    this.jwtResetSecret = jwtResetSecret;
    this.emailFromUser = emailFromUser;
    this.emailFromPass = emailFromPass;
    this.emailHost = emailHost;
    this.emailPort = emailPort;
    this.emailSecure = emailSecure;
    this.clientBaseUrl = clientBaseUrl;
    this.verifyEmailHeading = verifyEmailHeading;
    this.verifyEmailSubjectLine = verifyEmailSubjectLine;
    this.verifyEmailMessage = verifyEmailMessage;
    this.verifyEmailRedirect = verifyEmailRedirect;
    this.resetEmailHeading = resetEmailHeading;
    this.resetEmailSubjectLine = resetEmailSubjectLine;
    this.resetEmailMessage = resetEmailMessage;
    this.resetEmailRedirect = resetEmailRedirect;
    this.passwordLength = passwordLength;
    this.jwtSessionExpiration = jwtSessionExpiration;
    this.jwtResetExpiration = jwtResetExpiration;

    // create custom user model
    this.userModel = userModel;
  }

  /**
   * Express middleware. Validates user and adds user to req object.
   */
  isLoggedIn = async (req, res, next) => {
    // check if cookies exist
    const cookies = req.headers.cookie;
    if (!cookies) {
      res.status(401).send('Authentication failed.');
      return;
    }

    // check for cookie named 'session'
    let user;
    for (let cookie of cookies.split(';')) {
      const cookieSplit = cookie.split('=');
      if (cookieSplit.length === 2) {
        const name = cookieSplit[0].trim();
        const value = cookieSplit[1].trim();
        if (name && value && name === 'session') {
          // get user from database based on user id in jwt token
          try {
            const payload = jwt.verify(value, this.jwtSecret);
            user = await this.getUser(payload.user.id);
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
          }
        }
      }
    }

    // user does not exist
    if (!user) {
      res.status(401).send('Authentication failed.');
      return;
    }

    // assign user to req object
    req.user = user;
    next();
  };

  /**
   * Express middleware. Validates user and adds user to req object.
   */
  isAdmin = async (req, res, next) => {
    // no user session
    if (!req.user) {
      res.status(401).send('User session not found.');
    }

    // user is not admin
    if (req.user.auth !== 'ADMIN') {
      res.status(403).send('User does not have permission to access this resource.');
    }

    next();
  };

  /**
   * Returns a user based on user id.
   * Sensitive fields are omitted such as passwords and tokens.
   */
  getUser = async (id) => {
    return await this.userModel.findById(id).select('-password');
  };

  /**
   * Registers a user with given name, email and password.
   */
  register = async (res, userInfo) => {
    const { name, email, password, ...other } = userInfo;
    try {
      // check if user exists
      let user = await this.userModel.findOne({ email });
      if (user) {
        throw new Error('User already exists.');
      }

      // check password length
      if (password.length < this.passwordLength) {
        throw new Error(`Password must be at least ${this.passwordLength} characters.`);
      }

      // get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // encrypt password: convert text password to a hash value
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // create a new instance of user
      user = new this.userModel({
        name,
        email,
        avatar,
        password: hashedPassword,
        ...other,
      });

      // create session
      this.createSession(res, user.id);

      // send verification email
      this.sendVerificationEmail(user);
    } catch (err) {
      console.error(err);
      throw new Error('Registration failed.');
    }
  };

  /**
   * Verifies user with given verification token.
   */
  verify = async (token) => {
    // token is missing
    if (!token) {
      throw new Error('Authentication Error.');
    }

    // get user from token
    let user;
    try {
      const payload = jwt.verify(token, this.jwtSecret);
      user = await this.userModel.findById(payload.user.id);
    } catch (err) {
      console.error(err);
      throw new Error('Token has either expired or is invalid');
    }

    // user does not exist
    if (!user) {
      throw new Error('Token has either expired or is invalid');
    }

    // user is already verified
    if (user.verifyEmail === true) {
      throw new Error('You have already verified your email address. Thank you.');
    }

    // verify user
    else {
      user.verifyEmail = true;
      user.verifyEmailToken = [];
      try {
        await user.save();
      } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
      }
    }

    return user;
  };

  /**
   * Logs in user with given email and password and returns a session token.
   */
  login = async (res, userInfo) => {
    const { email, password } = userInfo;
    try {
      // validate email
      let user = await this.userModel.findOne({ email });
      if (!user) {
        throw new Error('Invalid Credentials.');
      }

      // validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid Credentials.');
      }

      // create session
      this.createSession(res, user.id);
    } catch (err) {
      console.error(err);
      throw new Error(err.message || 'Internal Server Error');
    }
  };

  /**
   * Deletes user session in the Response object, effectively logging the user out.
   */
  logout = (res) => {
    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.jwtSessionExpiration * 1000,
    });
  };

  /**
   * Changes a user's password to a new password.
   */
  changePassword = async (res, { resetToken, newPassword }) => {
    // validate params
    if (!resetToken || !newPassword) {
      throw new Error('Authentication Error.');
    }

    // check password length
    if (newPassword.length < this.passwordLength) {
      throw new Error(`Password must be at least ${this.passwordLength} characters.`);
    }

    // find user with reset token
    let user;
    try {
      const payload = jwt.verify(resetToken, this.jwtResetSecret);
      user = await this.userModel.findOne({ _id: payload.user.id });
    } catch (err) {
      console.error(err);
      throw new Error('Token has either expired or is invalid.');
    }

    // user not found
    if (!user) {
      throw new Error('Token has either expired or is invalid.');
    }

    // encrypt password: convert text password to a hash value
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // saving hashed password to user object
    user.password = hashedPassword;
    user.resetToken = [];
    await user.save();

    // create session (good UX to log in user after password reset)
    this.createSession(res, user.id);
  };

  /**
   * Creates and/or updates session cookie and attaches it to response object.
   */
  createSession = (res, userId) => {
    // create session token
    const payload = {
      user: {
        id: userId,
      },
      createdAt: Date.now(),
    };
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtSessionExpiration,
    });

    // set token as session cookie on res object
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.jwtSessionExpiration * 1000,
    });
  };

  /**
   * Creates verification token in given user document
   * and sends verification mail to user's email.
   */
  sendVerificationEmail = async (user) => {
    // create payload
    const payload = {
      user: {
        id: user.id,
      },
      createdAt: Date.now(),
    };

    // sign the token with payload and secret
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtSessionExpiration, // in seconds
    });

    // update user with verification token
    user.verifyEmail = false;
    user.verifyEmailToken = [...user.verifyEmailToken, token];

    // save user object in mongodb
    await user.save();

    // create email template
    const redirect = `${this.clientBaseUrl}${this.verifyEmailRedirect}`;
    const defaultLink = `<h4><a href="${redirect}/${token}">Verify Email Address</a></h4>`;
    const defaultMessage = `
        <div style="margin: auto; width: 40%; padding: 10px">
          <h2>Email Verification Request</h2>
          <p>To verify your email address so you can continue to use your account, click the following link:</p>
          ${defaultLink}
          <p>Thanks for joining the community.</p>	
        </div>`;
    const defaultSubjectLine = 'Please Verify Your Email Address';

    // send mail
    sendMail(
      user.email,
      defaultLink,
      defaultMessage,
      defaultSubjectLine,
      this.emailFromUser,
      this.emailFromPass,
      this.verifyEmailHeading,
      this.verifyEmailSubjectLine,
      this.emailHost,
      this.emailPort,
      this.emailSecure,
      this.verifyEmailMessage
    );
  };

  /**
   * Creates password reset token in given user document
   * and sends password reset mail to user's email.
   */
  sendPasswordResetEmail = async (email) => {
    // verify that user exists
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User with given email does not exist.');
    }

    // create password reset token
    const payload = {
      user: {
        id: user.id,
      },
      createdAt: Date.now(),
    };
    const token = jwt.sign(payload, this.jwtResetSecret, {
      expiresIn: this.jwtResetExpiration, // in seconds
    });

    // add token to user
    user.resetToken = [...user.resetToken, token];
    await user.save();

    // generate email template
    const redirect = `${this.clientBaseUrl}${this.resetEmailRedirect}`;
    const defaultLink = `<h4><a href="${redirect}/${token}">Reset Password</a></h4>`;
    const defaultMessage = `
      <div style="margin: auto; width: 40%; padding: 10px">
        <h2>Password Assistance</h2>
        <p>To authenticate, please click on the Reset Password link below. It will expire in ${Math.floor(
          this.jwtResetExpiration / 60
        )} minutes.</p>
        ${defaultLink}
        <p>Do not share this link with anyone. We take your account security very seriously. We will never ask you to disclose or verify your password, OTP, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link. Instead, notify us immediately and share the email with us for investigation.</p>
        <p>We hope to see you again soon.</p>	
      </div>`;
    const defaultSubjectLine = 'Reset Password Request';

    // send email to user
    await sendMail(
      user.email,
      defaultLink,
      defaultMessage,
      defaultSubjectLine,
      this.emailFromUser,
      this.emailFromPass,
      this.resetEmailHeading,
      this.resetEmailSubjectLine,
      this.emailHost,
      this.emailPort,
      this.emailSecure,
      this.resetEmailMessage
    );
  };
}

module.exports = LoginExpress;
