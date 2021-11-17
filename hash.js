const bcrypt = require('bcryptjs')

const password = '123456789'
const salt = '$2b$10$FEqKdfTK9AZPzbqeAnH/Lu'
console.log(salt)
const hash = bcrypt.hashSync(password, salt)
console.log(hash)


