const bcrypt = require('bcrypt');

const password = 'hihi123';

const salt = bcrypt.genSaltSync();
console.log(salt);
const hash = bcrypt.hashSync(password, salt);

console.log(hash);