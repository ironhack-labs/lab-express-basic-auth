const bcrypt = require("bcrypt")

const saltRounds = 13

const plainPassword1 = "HelloWorld"
const plainPassword2 = "helloworld"

const salt = bcrypt.genSaltSync(saltRounds)

const hash1 = bcrypt.hashSync(plainPassword1, salt)
const hash2 = bcrypt.hashSync(plainPassword1, salt)
const hash3 = bcrypt.hashSync(plainPassword2, salt)

// const verify = bcrypt.compareSync(req.body.password, user.password)

console.log(hash1)
console.log(hash2)
console.log(hash3)
