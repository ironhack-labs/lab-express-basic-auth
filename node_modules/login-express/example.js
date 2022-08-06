const express = require('express');
const app = express();
const helmet = require('helmet');
const loginJS = require('login-express');

// middleware
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbConfig = {
  mongodbURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
};

const appConfig = {
  jwtResetSecret: process.env.JWT_RESET_SECRET,
  emailFromUser: process.env.EMAIL_FROM_USER,
  emailFromPass: process.env.EMAIL_FROM_PASS,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailSecure: process.env.EMAIL_SECURE,
};

loginJS(dbConfig, appConfig, app, express);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
