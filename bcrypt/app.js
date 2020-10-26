const bcrypt = require("bcryptjs");

const zxcvbn = require('zxcvbn')

const saltRounds = 10;

const plainPassword1 = "HelloWorld";
const plainPassword2 = "helloWorld";

const salt = bcrypt.genSaltSync(saltRounds);

const hash1 = bcrypt.hashSync(plainPassword1, salt);
const hash2 = bcrypt.hashSync(plainPassword2, salt);

console.log("Hash1 ", hash1);
console.log("Hash2 ", hash2);

console.log(zxcvbn("TroublingUnchangedCollideProofingSurfaceOutfit"))