const bcrype = require('bcrypt');

const password = '123456';

// salt is a string that is create before hash
// used alongside the hash
const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync(password, salt);