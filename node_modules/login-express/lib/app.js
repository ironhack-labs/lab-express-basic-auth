/*!
 * loginJS
 * Copyright(c) 2020 Anis Merchant and Freddy Shim
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const connectDB = require('./config/db');
const registerUser = require('./routes/api/register');
const loginUser = require('./routes/api/login');
const verifyUser = require('./routes/api/verify');
const resetPassword = require('./routes/api/reset');

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create a loginJS application.
 * @api public
 */

function createApplication(
  dbConfig,
  appConfig,
  app,
  express,
  verifyEmailConfig = {},
  resetEmailConfig = {},
  basePath = '/api'
) {
  // connect database
  connectDB(dbConfig.mongodbURI);

  // create login system
  createLogin(dbConfig, appConfig, app, express, verifyEmailConfig, basePath);

  // create reset password system
  createResetPassword(
    dbConfig,
    appConfig,
    app,
    express,
    resetEmailConfig,
    basePath
  );
}

/**
 * DEPRECATED: /api path is not recommended to use.
 * Please use the /auth path instead.
 */
function createLogin(
  { jwtSecret, passwordLength = 8, jwtSessionExpiration = 7200 },
  { emailFromUser, emailFromPass, emailHost, emailPort, emailSecure },
  app,
  express,
  { emailHeading = '', emailSubjectLine = '', emailMessage = '' },
  basePath
) {
  // validate optional parameter type
  try {
    if (
      !Number.isInteger(passwordLength) ||
      !Number.isInteger(jwtSessionExpiration)
    ) {
      return console.log(
        '"passwordLength" and "jwtSessionExpiration" must be positive integers.'
      );
    }

    if (passwordLength < 0 || jwtSessionExpiration < 0) {
      return console.log(
        '"passwordLength" and "jwtSessionExpiration" must be positive integers.'
      );
    }

    // define routes
    app.use(
      `${basePath}/register`,
      registerUser(
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
      )
    );

    app.use(
      `${basePath}/login`,
      loginUser(
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
      )
    );

    app.use(`${basePath}/verify-email`, verifyUser(jwtSecret, express));
  } catch (err) {
    console.error(err.message);
  }
}

function createResetPassword(
  { passwordLength = 8 },
  {
    jwtResetSecret,
    jwtResetExpiration = 900,
    emailFromUser,
    emailFromPass,
    emailHost,
    emailPort,
    emailSecure,
  },
  app,
  express,
  { emailHeading = '', emailSubjectLine = '', emailMessage = '' },
  basePath
) {
  try {
    if (!Number.isInteger(jwtResetExpiration) || jwtResetExpiration < 0) {
      return console.log('"jwtResetExpiration" must be a positive integer.');
    }

    // define routes
    app.use(
      `${basePath}/reset-password`,
      resetPassword(
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
      )
    );

    // define routes
    app.use(
      `${basePath}/forgot-password`,
      resetPassword(
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
      )
    );
  } catch (err) {
    console.error(err.message);
  }
}
