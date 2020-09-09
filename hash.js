const bcrypt = require("bcrypt")

const password = "123345"

const salt = bcrypt.genSalt();
const hash = bcrypt.hashSync(password, salt)

