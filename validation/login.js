const Validator = require('validator');
const isEmpty = require('../validation/is_empty');

module.exports = function validateLoginInput(user) {
    let errors = {};

    user.email = (!isEmpty(user.email)) ? user.email :  '';
    user.password = (!isEmpty(user.password)) ? user.password : '';

    if(!Validator.isEmail(user.email)){
        errors.email = 'Please Enter a Valid email';
    }

    if(isEmpty(user.email))
    {
        errors.email = 'Email Feild is empty';
    }

    if(isEmpty(user.password))
    {
        errors.password = 'Password feild is empty';
    }
    
    return{
        errors,
        isValid : isEmpty(errors)
    }
}
