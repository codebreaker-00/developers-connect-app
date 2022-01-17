const Validator = require('validator');
const isEmpty = require('../validation/is_empty');

module.exports = function validateEducationInput(data){
    const errors = {};

    data.school = isEmpty(data.school) ? '' : data.school;
    data.degree = isEmpty(data.degree) ? '' : data.degree;
    data.feildofstudy = isEmpty(data.feildofstudy) ? '' : data.feildofstudy;
    data.from = isEmpty(data.from) ? '' : data.from;
    
    if(Validator.isEmpty(data.school))
    {
        errors.school = 'School Name is required';
    }
    if(Validator.isEmpty(data.degree))
    {
        errors.degree = 'Degree is required';
    }
    if(Validator.isEmpty(data.feildofstudy))
    {
        errors.feildofstudy = 'Feild of Study is required';
    }

    if(Validator.isEmpty(data.from))
    {
        errors.from = 'From Date Feild is required';
    }

    return{
        errors,
        isValid : isEmpty(errors)
    };
};   