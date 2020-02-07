const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const hashPassword = text => {
  const hash = bcrypt.hashSync(text, salt);
  return hash;
};

const checkHashed = bcrypt.compareSync;

module.exports = {
  hashPassword,
  checkHashed
};
