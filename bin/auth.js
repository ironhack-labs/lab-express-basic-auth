const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

class Authenticator {
    
    async validateInfo (user) {
        const validationErrors = {};

        try {
            const findUser = await User.findOne( { email: user.email })

            if (findUser) {
                validationErrors.emailError = 'Email already registered. Please proceed to login.';
            } else {
                for (const prop in user) {
                    if (!user[prop].trim().length) {
                        validationErrors[prop + 'Error'] = 'This field must be informed.'
                    }
                }
            }

            return validationErrors;
        } 
        
        catch (error) {
            return error;
        }       
    }

    async encrypt (password) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        return bcrypt.hashSync(password, salt);
    }
}

const authenticator = new Authenticator();

module.exports = authenticator;