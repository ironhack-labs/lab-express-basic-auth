const bcrypt = require("bcrypt");

const encryptedFox = bcrypt.hashSync("fox", 10);
console.log(encryptedFox);

const encryptedEmpty = bcrypt.hashSync("", 10);
console.log(encryptedEmpty);