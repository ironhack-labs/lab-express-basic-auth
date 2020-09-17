const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Recive a plain password and encrypt with bcrypt libary using 10 rounds Salt
async function encrypt(pass) {
  const salt = await bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(pass, salt);
}

// Recive a plain and 
function compareEncrypted(pass, hash) {
  return bcrypt.compareSync(pass, hash);
}

// export { encrypt, decrypt };
module.exports = { encrypt, compareEncrypted };
