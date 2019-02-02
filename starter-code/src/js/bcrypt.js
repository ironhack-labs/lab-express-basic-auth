const bcrypt       = require("bcrypt");
const saltRounds   = 10;

const salt = bcrypt.genSaltSync(saltRounds);
const encriptPassword = password =>bcrypt.hashSync(password, salt);


module.exports = encriptPassword;