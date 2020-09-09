const bcrypt = require("bcrypt");
// const password = "1234";

const salt = bcrypt.genSaltSync();

const hash = bcrypt.hashSync(password, salt);
