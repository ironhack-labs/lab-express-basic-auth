const bcrypt = require("bcrypt");

const password = "password";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
