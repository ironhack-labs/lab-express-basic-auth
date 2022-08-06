# Login.js

Minimalist module built to set up a secure back-end express login system in record speed. Login.js seemlessly adds to your existing express server and sets up secure login routes.

## Installation

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

For brand new projects, be sure to create a `package.json` first with the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Next, run the following command in your terminal:

```bash
npm i login-express
```

### Dependencies

This package is meant to be used in Node.js with [Express](https://github.com/expressjs/express) and [Mongoose](https://github.com/Automattic/mongoose). Make sure to install these dependencies when using `login-express` in your project:

```bash
npm i express mongoose
```

You must also have the URI of a running MongoDB cluster. We recommend getting started with a [free MongoDB Atlas cluster](https://www.mongodb.com/docs/atlas/getting-started/).

## Simple Setup

Create an `index.js` file, and paste the starter code as shown below. It assumes you've using Express.js.

   ```js
   const express = require('express');
   const app = express();
   const loginJS = require('login-express');

   const dbConfig = {
     mongodbURI: 'my-mongodb-uri', // required
     jwtSecret: 'jwt-secret', // required
     passwordLength: 10, // default: 8
     jwtSessionExpiration: 3600 // default: 7200
   };

   const appConfig = {
     jwtResetSecret: 'jwt-reset-secret', // required
     emailFromUser: 'myemail@example.com', // required
     emailFromPass: 'myemailpassword', // required
     emailHost: 'stmp.myemailserver.com', // required
     emailPort: 465, // required
     emailSecure: true, // required
     jwtResetExpiration: 1000, // default: 900
     basePath: '/auth' // default: '/api'
   };

   loginJS(dbConfig, appConfig, app, express);
   ```

   You can pass in custom email templates for verification and/or password reset requests.

   ```js
   let verifyEmailConfig = {
     emailHeading: 'Your Company Name',
     emailSubjectLine: 'Verify Password',
     emailMessage: 'Custom verify password message goes here. Verify link is auto-generated.'
   };

   let resetEmailConfig = {
     emailHeading: 'Your Company Name',
     emailSubjectLine: 'Reset Password',
     emailMessage: 'Custom reset password message goes here. Reset link is auto-generated.'
   };

   // pass these config objects into the loginJS method 
   loginJS(dbConfig, appConfig, app, express, verifyEmailConfig, resetEmailConfig);
   ```

### API Endpoints

The <b>Simple Setup</b> creates API routes for you to use. Below endpoints are created upon calling the `loginJS` method with the default basePath value of `/api`:

Register Client

   ```text
   POST: /api/register
   ```

Get Authorized Client

   ```text
   GET: /api/login
   ```

Sign In Client

   ```text
   POST: /api/login
   ```

Verify Email Address

   ```text
   PATCH: /api/verify-email
   ```

Forgot Password

   ```text
   PUT: /api/forgot-password
   ```

Reset Password

   ```text
   PATCH: /api/reset-password
   ```

### Mongoose ORMs

The <b>Simple Setup</b> creates a `user` mongoose schema and document. You do not need to create or modify the user document, as it is created upon calling the `loginJS` method.

Below is the code that initializes the user schema and document at `lib/models/User.js`:
```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  verifyEmail: {
    type: Boolean,
  },
  verifyEmailToken: {
    type: String,
    default: '',
  },
  resetToken: {
    type: String,
    default: '',
  },
});

module.exports = User = mongoose.model('user', UserSchema);
``` 

## Advanced Setup (Class-Based Manager)

The code outlined in <b>Quick Setup</b> automatically creates routes and user schemas for you. If you need more fine-tuned control over your Express server, then use the `LoginExpress` class instead:

```js
const express = require('express');
const mongoose = require('mongoose');
const { LoginExpress } = require('login-express');

// initialize express
const app = express();

// initialize db
mongoose.connect('my-mongodb-uri');

// initialize ORM
const accountSchema = new mongoose.Schema({
  // required fields
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  verifyEmail: { type: Boolean, default: false },
  verifyEmailToken: { type: [String], default: [] },
  resetToken: { type: [String], default: [] },
  auth: { type: String, default: 'USER' },
  // example of custom field
  customField: { type: String, default: 'initialValue' },
})
const accountModel = mongoose.model('Account', accountSchema);

// intialize login-express
const loginJS = new LoginExpress({
  jwtSecret: 'jwt-secret',
  jwtResetSecret: 'jwt-reset-secret',
  emailFromUser: 'myemail@example.com',
  emailFromPass: 'myemailpassword',
  emailHost: 'stmp.myemailserver.com',
  userModel: accountModel,
  clientBaseUrl: 'http://localhost:3000'
});

// create express router
const router = express.Router();

// get user
router.get('/user', loginJS.isLoggedIn, (req, res) => {
  res.status(200).send(req.user)
});

// register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await loginJS.register(res, { name, email, password });
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    await loginJS.login(res, { email, password });
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// logout
router.post('/logout', loginJS.isLoggedIn, async (req, res) => {
  try {
    loginJS.logout(res);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// send verification email
router.post(
  '/send-verify-email',
  loginJS.isLoggedIn,
  async (req, res) => {
    try {
      await loginJS.sendVerificationEmail(req.user);
      res.status(200).end();
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

// verify email
router.patch('/verify-email', async (req, res) => {
  const { token } = req.body;
  try {
    await loginJS.verify(token);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// request password change
router.post('/send-reset-password', async (req, res) => {
  const { email } = req.body
  try {
    await loginJS.sendPasswordResetEmail(email);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
})

// change password
router.patch('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    await loginJS.changePassword(res, { resetToken, newPassword });
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
})

// all routes have a /auth path prefix
app.use('/auth', router);

// run express server
app.listen(5000, () => console.log('Server started on port 5000'));
```

## Features

- Client sign up and sign In

- Client gravatar

- Encrypted password storage in MongoDB

- Client authentication and reset password

- Client email verification

- Reset password email sent to the client

- Verify email sent to the client

## TypeScript

`loginJS` supports TypeScript out of the box. Using some parts of the package requires you to use types that are provided by the package:

### Middlewares

```ts
import { LoginExpress, AuthRequest } from 'login-express';

const loginJS = new LoginExpress({
  // ...
});

// ...

// get user
router.get('/user', loginJS.isLoggedIn, (req: AuthRequest, res) => {
  res.status(200).send(req.user);
});
```

## Testing Endpoints in Postman (illustrations)

Register Client

```text
Shows the req object with the client's name, email, and password sent to the server, and it shows the res object returned with the token.
```

![register-client](https://user-images.githubusercontent.com/5770541/97674924-bcb59280-1a64-11eb-98b7-b81d9748d2bd.png)

Get Authorized Client Information

```text
Shows x-auth-token and its value set in the headers, and it shows the res object returned with the client details.
```

![get-auth-client](https://user-images.githubusercontent.com/5770541/97674969-cf2fcc00-1a64-11eb-9458-14c139998a37.png)

Sign In Client

```text
Shows the req object sent with the client email and password to the server, and it shows the res object returned with the token.
```

![signin-client](https://user-images.githubusercontent.com/5770541/97674986-d48d1680-1a64-11eb-923f-7e4e99ecf4b2.png)

Verify Email Address

```text
Shows the req object sent with the 'verifyEmailToken' to the server, and it shows the res object returned with a msg to the client.
```

![verify-email](https://user-images.githubusercontent.com/5770541/97675005-db1b8e00-1a64-11eb-8caa-b7247895ac5b.png)

Forgot Password

```text
Shows the req object sent with the client email to the server, and it shows the res object returned with a msg to the client.
```

![forgot-password](https://user-images.githubusercontent.com/5770541/97675034-ebcc0400-1a64-11eb-8e79-f61305b88bc8.png)

Reset Password

```text
Shows the req object sent with the 'resetToken' and client's 'newPassword' to the server, and it shows the res object returned with a msg to the client.
```

![reset-password](https://user-images.githubusercontent.com/5770541/97675039-ed95c780-1a64-11eb-80dd-4e7e8dcc9f53.png)

Reset Password Email Sent to Client

![reset-email](https://user-images.githubusercontent.com/5770541/97639557-32920d80-1a15-11eb-8c01-36f8cc9f6715.png)

Verification Email Sent to Client

![verify-your-email](https://user-images.githubusercontent.com/5770541/97639629-55bcbd00-1a15-11eb-82f6-5e22eca8c6d7.png)

## Security Issues

If you discover a security vulnerability or would like to help me improve Login.js, please email me. Alternatively, submit a pull request at this project's Github, and we'll go from there. Thank you for your support.
