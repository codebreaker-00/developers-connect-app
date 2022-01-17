const Validator = require('validator');
const isEmpty = require('../validation/is_empty');

module.exports = function validateRegisterInput(user) {
    let errors = {};

    user.name = (!isEmpty(user.name)) ? user.name : '';
    user.email = (!isEmpty(user.email)) ? user.email :  '';
    user.password = (!isEmpty(user.password)) ? user.password : '';
    user.password2 = (!isEmpty(user.password2)) ? user.password2 : '';

    if(!Validator.isLength(user.name, {min:2, max:30})){
        errors.name = 'Name must have characters between 2 and 30 characters';
    }

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

    if(!Validator.isLength(user.password, {min:2, max:30}))
    {
        errors.password = 'Password must be within 2 to 30 characters';
    }

    if(!Validator.equals(user.password, user.password2))
    {
        errors.password2 = 'Passwords must match';
    }

    if(isEmpty(user.password2))
    {
        errors.password2 = 'Confirm Password is required';
    }

    return{
        errors,
        isValid : isEmpty(errors)
    }
}
