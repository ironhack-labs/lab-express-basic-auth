const bcrypt = require('bcrypt')
const password = '123456'
const salt = bcrypt.genSaltSync()
console.log('salt: ', salt)
const hash = bcrypt.hashSync(password, salt)
console.log('hash: ', hash) 