const bcrypt = require("bcrypt");
const saltRounds = 5;
const plainPassword = "laura";
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(plainPassword, salt);
console.log(`plainPassword: ${plainPassword}
-- salt: ${salt}
-- hash: ${hash}`);
console.log(bcrypt.compareSync(plainPassword, `${hash}`));