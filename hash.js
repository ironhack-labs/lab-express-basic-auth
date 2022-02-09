const bcrypt = require('bcryptjs')

const password = '345'

const salt = '$2a$10$WcfXc8sGaMrFk6uCWjXJLu'
console.log(salt)
console.log(salt.length)
const hash = bcrypt.hashSync(password, salt)
console.log(hash)