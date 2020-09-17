const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Receive a plain password and encrypt with bcrypt libary using 10 rounds Salt
async function encrypt(pass) {
  const salt = await bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(pass, salt);
}

// Receive a plain a
function compareEncrypted(pass, hash) {
  return bcrypt.compareSync(pass, hash);
}

// export { encrypt, decrypt };
module.exports = { encrypt, compareEncrypted };
