const bcrypt = require('bcrypt');

const password = '123456';

const salt = '$2b$10$DU2Sck/N9mj4vwZblfmS.O';

console.log({ salt });

const hash = bcrypt.hashSync(password, salt);

console.log({ hash });

function compare(password, hash) {
  const salt = hash.slice(0, 29);
  return hash === bcrypt.hashSync(password, salt)
}

console.log(compare('123457', hash))