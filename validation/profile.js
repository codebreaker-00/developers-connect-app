const Validator = require('validator');
const isEmpty = require('../validation/is_empty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = isEmpty(data.handle) ? '' : data.handle;
    data.status = isEmpty(data.status) ? '' : data.status;
    data.skills = isEmpty(data.skills) ? '' : data.skills;

    if(!Validator.isLength(data.handle, {min:2 , max:40}))
    {
        errors.handle = 'Handle must be having a length of 2 to 40 characters';
    }

    if(Validator.isEmpty(data.handle))
    {
        errors.handle = 'Handle is required';
    }

    if(Validator.isEmpty(data.status))
    {
        errors.status = 'Status is required';
    }

    if(Validator.isEmpty(data.skills))
    {
        errors.skills = 'Skills is required';
    }

    if(!isEmpty(data.website))
    {
        if(!Validator.isURL(data.website))
        {
            errors.website = 'Not a valid URl';
        }
    }
    if(!isEmpty(data.youtube))
    {
        if(!Validator.isURL(data.youtube))
        {
            errors.youtube = 'Not a valid URl';
        }
    }

    if(!isEmpty(data.twitter))
    {
        if(!Validator.isURL(data.twitter))
        {
            errors.twitter = 'Not a valid URl';
        }
    }

    if(!isEmpty(data.instagram))
    {
        if(!Validator.isURL(data.instagram))
        {
            errors.instagram = 'Not a valid URl';
        }
    }

    if(!isEmpty(data.facebook))
    {
        if(!Validator.isURL(data.facebook))
        {
            errors.facebook = 'Not a valid URl';
        }
    }


    return{
        errors,
        isValid : isEmpty(errors)
    };
};