const bcrypt     = require("bcrypt");
// this sets the password computation complexity and timing
const saltRounds = 10;

const plainPassword1 = "HelloWorld";
const plainPassword2 = "HelloWorld";

// salt is a complexifier
const salt  = bcrypt.genSaltSync(saltRounds);

// salt + hashSync generates the final encrypted password
const hash1 = bcrypt.hashSync(plainPassword1, salt);
const hash2 = bcrypt.hashSync(plainPassword2, salt);

// hash1 and hash2 are the encrypted password you MUST use
console.log("Hash 1 -", hash1);
console.log("Hash 2 -", hash2);