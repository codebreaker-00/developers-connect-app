const Validator = require('validator');
const isEmpty = require('../validation/is_empty');

module.exports = function validatePostInput(data){
    const errors = {};
    data.text = isEmpty(data.text) ? '' : data.text;

    if(!Validator.isLength(data.text, {min : 10, max:300}))
    {
        errors.text = 'Post must be having 10 to 300 characters';
    }

    if(Validator.isEmpty(data.text))
    {
        errors.text = 'Post requires text';
    }

    return{
        errors,
        isValid : isEmpty(errors)
    }
}
