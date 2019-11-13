const bcrypt = require("bcrypt");

const plainText = "Hello World!";

const salt = bcrypt.genSaltSync();

console.log(salt);

const hash = bcrypt.hashSync(plainText, "$2b$10$WZkDdUaVEiw4ju8l3.xHiO");

console.log(hash);
