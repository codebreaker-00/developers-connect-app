const Validator = require('validator');
const isEmpty = require('../validation/is_empty');

module.exports = function validateExperienceInput(data){
    const errors = {};

    data.title = isEmpty(data.title) ? '' : data.title;
    data.company = isEmpty(data.company) ? '' : data.company;
    data.from = isEmpty(data.from) ? '' : data.from;
    data.to = isEmpty(data.to) ? '' : data.to;

    if(Validator.isEmpty(data.title))
    {
        errors.title = 'Title Field is required';
    }

    if(Validator.isEmpty(data.company))
    {
        errors.company = 'Company Field is required';
    }

    if(Validator.isEmpty(data.from))
    {
        errors.from = 'From Date Field is required';
    }

    return{
        errors,
        isValid : isEmpty(errors)
    };
}