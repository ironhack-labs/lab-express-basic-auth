const bcrypt = require('bcryptjs');

const saltRounds = 10;

const generateEncryptedPassword = async password => {
  const salt = await bcrypt.genSalt(saltRounds);

  const encryptedPassword = bcrypt.hashSync(password, salt);

  return encryptedPassword;
};

const verifyPassword = (passwordFromForm, passwordFromDb) => {
  return bcrypt.compareSync(passwordFromForm, passwordFromDb);
};

module.exports = {
  generateEncryptedPassword,
  verifyPassword,
};
