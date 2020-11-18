const bcrypt = require('bcrypt');
const password = '123456';
const salt = bcrypt.genSaltSync();
console.log(salt);
const hash = bcrypt.hashSync(password, '$2b$10$NLo2Yg55MK1heuqLr7G2/.');
console.log({ hash });